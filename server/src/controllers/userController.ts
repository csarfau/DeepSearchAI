import { Request, Response } from 'express';
import SuggestionGenerationService, { PageSuggestion } from '../services/suggestionGenerationService';
import UserRepository from '../repositories/userRepository';

const userRepository = new UserRepository(); 

export default class UserController {

    public async test(req: Request, res: Response) {

        
        return res.status(200).json({
            data: await userRepository.getUserByID(req.params.id)
        })
    }

    public async saveThemeSuggestions(req: Request, res: Response) {
        return res.status(201).json({
            data: await userRepository.insertUsersTheme(req.params.id, req.body.usersThemes)
        })
    }

    public async getUsersSuggestions(req: Request, res: Response) {

        const themesNames = await userRepository.getUsersThemes(req.params.id);

        const suggestionService = new SuggestionGenerationService();
        const suggestions = await suggestionService.generatePrompt(themesNames, 6);
        return res.status(200).json({
            data: suggestions 
        })
    }

    public async getThemes(req: Request, res: Response) {
        const themes = await userRepository.getThemes();
        return res.status(200).json({
            data: themes
        })
    }

    public async getUsersPagesSuggetions(req: Request, res:Response) {

        const themesNames= await userRepository.getUsersThemes(req.params.id);

        const suggestionService = new SuggestionGenerationService();
        
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
