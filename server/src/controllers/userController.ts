import { Request, Response } from 'express';
import SuggestionGenerationService from '../services/suggestionGenerationService';
import UserRepository from '../repositories/userRepository';
import { IUser } from '../types/user';
import bcrypt, { compare } from 'bcrypt';
import { createToken } from '../utils/token';

const userRepository = new UserRepository(); 
const suggestionService = new SuggestionGenerationService();

export default class UserController {

    public async createUser(req: Request, res: Response) {
        const { email, password } = req.body;

        const user: IUser = {
            email,
            password: await bcrypt.hash(password, 10)
        }

        return res.status(201).json({
            data: await userRepository.createUser(user)
        });
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await userRepository.getUserByEmail(email);
        if(!user) {
            return "Credentials not found."
        }

        const comparePassword = await compare(password as string, user.password as string);
        if(!comparePassword) {
            return "Credentials not found.";
        }

        const token = createToken({ id: user.id as string, email }, { expiresIn: "1d" });

        return res.status(200).json({token});
    } 

    public async saveThemeSuggestions(req: Request, res: Response) {
        return res.status(201).json({
            data: await userRepository.insertUsersTheme(req.params.id, req.body.usersThemes)
        })
    }

    public async getUsersSuggestions(req: Request, res: Response) {
        const themesNames = await userRepository.getUsersThemes(req.params.id);
        const suggestions = await suggestionService.generatePrompt(themesNames, 6);
        return res.status(200).json({
            data: suggestions 
        })
    }

    public async getThemes(req: Request, res: Response) {
        console.log(req);
        
        const themes = await userRepository.getThemes();
        return res.status(200).json({
            data: themes
        })
    }

    public async getUsersPagesSuggetions(req: Request, res:Response) {

        const themesNames= await userRepository.getUsersThemes(req.params.id);
        const pageData= await suggestionService.generatePagesSuggestions(themesNames);
    
        const pageDataWithType = pageData.map((data, index) => ({    
            type: themesNames[index],
            pageData: data       
        }))

        return res.status(200).json({ 
            data: pageDataWithType 
        });
    }
}
