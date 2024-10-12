import { Request, Response } from 'express';
import UserRepository from '../repositories/userRepository';
import { IUserRepository } from '../types/userTypes';

export default class UserController {

    constructor(private readonly userRepository: IUserRepository) {}

    public async test(req: Request, res: Response) {
        return res.status(200).json({
            data: await this.userRepository.getUserByID(req.params.id)
        })
    }

    public async suggestions(req: Request, res: Response) {

    }
}
