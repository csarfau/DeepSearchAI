import { Request, Response } from 'express';
import UserRepository from '../repositories/userRepository';

export default class UserController {
    
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async register(req: Request, res: Response) {
        
    }
}
