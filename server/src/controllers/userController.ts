import { Request, Response } from "express";
import SuggestionGenerationService from "../services/suggestionGenerationService";
import UserRepository from "../repositories/userRepository";
import { IUser } from "../types/user";
import bcrypt, { compare } from "bcrypt";
import { createToken, verifyToken } from "../utils/token";
import sendEmail from "../services/sendEmail";
import createEmailToRecoverPassword from "../services/emailSenderPass";
import { CustomError } from "../helpers/customError";
import {
  RequestBodyValidator,
  RequestParamValidator,
} from "../helpers/requestValidator";

const userRepository = new UserRepository();
const suggestionService = new SuggestionGenerationService();

export default class UserController {
  public async createUser(req: Request, res: Response) {
    const { email = "", password = "" } = new RequestBodyValidator(req.body)
      .email()
      .password()
      .validate();
    const userExists = await userRepository.getUserByEmail(email);
    if (userExists) throw new CustomError(400, "User already exists.");

    const user: IUser = {
      email,
      password: await bcrypt.hash(password, 10),
    };

    return res.status(201).json({
      data: await userRepository.createUser(user),
    });
  }

  private async createGoogleUser(email: string, google_id: string) {
    const user: IUser = {
      email,
      google_id,
    };

    return await userRepository.createGoogleUser(user);
  }

  public async updateUserById(req: Request, res: Response) {
    const { id = ''} = new RequestParamValidator(req.params).uuid().validate();
    const { email, password } = req.body;

    if (password) {
      new RequestBodyValidator(req.body).email().password();
    } else {
      new RequestBodyValidator(req.body).email();
    }

    const userToUpdate = await userRepository.getUserByID(id);

    if (!userToUpdate) {
      throw new CustomError(404, "User not found.");
    }

    if (!req.user || req.user.id !== userToUpdate.id) {
      throw new CustomError(401, "Unauthorized Action");
    }

    const usedVerify = await userRepository.getUserByEmail(email);

    if (usedVerify && usedVerify.id !== userToUpdate.id) {
      throw new CustomError(409, "Invalid email.");
    }

    let user: IUser = { id, email };

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    res.status(200).json({
      data: await userRepository.updateUserById(user),
    });
  }

  public async sendRecoveryEmail(req: Request, res: Response) {
    const { email = "" } = new RequestBodyValidator(req.body)
      .email()
      .validate();

    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      throw new CustomError(404, "E-mail not found.");
    }

    await createEmailToRecoverPassword(user.id as string, email);
    return res.status(200).json({ message: "Email delivered." });
  }

  public async login(req: Request, res: Response) {
    const { email = "", password = "" } = new RequestBodyValidator(req.body)
      .email()
      .password()
      .validate();
    const { googleId } = req.body;

    if (googleId) {
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        const user = await this.createGoogleUser(email, googleId);
        const token = createToken(
          { id: user.id as string, email },
          { expiresIn: "1d" }
        );
        return res.status(201).json({ token });
      }

      const authGoogle = user.google_id === googleId;
      if (!authGoogle) throw new CustomError(401, "Credentials doesn't match.");

      const token = createToken(
        { id: user.id as string, email },
        { expiresIn: "1d" }
      );
      return res.status(200).json({ token });
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new CustomError(404, "Credentials not found.");
    }

    const comparePassword = await compare(
      password as string,
      user.password as string
    );
    if (!comparePassword) {
      throw new CustomError(401, "Credentials doesn't match.");
    }

    const token = createToken(
      { id: user.id as string, email },
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  }

  public async saveThemeSuggestions(req: Request, res: Response) {
    const { id = ''} = new RequestParamValidator(req.params).uuid().validate();
    const usersThemes: string[] = req.body.usersThemes;

    const themes = await userRepository.getThemes();

    const invalidThemes = usersThemes.filter(theme => 
      !themes.some(item => item.id === theme)
    );

    if (invalidThemes.length > 0) {
      throw new CustomError(409, 'Invalid theme Id(s).');
    }

    return res.status(201).json({
      data: await userRepository.insertUsersTheme(
        id,
        req.body.usersThemes
      ),
    });
  }

  public async getUsersSuggestions(req: Request, res: Response) {
    const { id = '' } = new RequestParamValidator(req.params).uuid().validate();

    const themesNames = await userRepository.getUsersThemes(id);
    const suggestions = await suggestionService.generatePrompt(themesNames, 6);
    return res.status(200).json({
      data: suggestions,
    });
  }

  public async getThemes(req: Request, res: Response) {
    const themes = await userRepository.getThemes();
    return res.status(200).json({
      data: themes,
    });
  }

  public async getUsersPagesSuggetions(req: Request, res: Response) {
    const { id = '' } = new RequestParamValidator(req.params).uuid().validate();

    const themesNames = await userRepository.getUsersThemes(id);
    const pageData = await suggestionService.generatePagesSuggestions(
      themesNames
    );

    const pageDataWithType = pageData.map((data, index) => ({
      type: themesNames[index],
      pageData: data,
    }));

    return res.status(200).json({
      data: pageDataWithType,
    });
  }

  public async resetPassword(req: Request, res: Response) {
    const { password = ''} = new RequestBodyValidator(req.body).password().validate();
    const token = req.headers.authorization?.split(" ")[1] as string;
    const hashedPassword = await bcrypt.hash(password, 10);
    const authenticatedUser = verifyToken(token);

    if (!authenticatedUser) {
      throw new CustomError(401, "Invalid token, try again.");
    }

    const email = authenticatedUser.email;
    return res.status(200).json({
      data: await userRepository.resetPassword(hashedPassword, email),
    });
  }
}
