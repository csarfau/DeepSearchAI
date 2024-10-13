import { Router } from 'express';
import UserController from '../controllers/userController';
import UserRepository from '../repositories/userRepository';
import { db } from '../database/knex';

const userRouter = Router();

const userRepository = new UserRepository(db); 
const userController = new UserController(userRepository);

userRouter.get('/user/:id', (req, res) => userController.test(req, res));
userRouter.post('/user/:id/themes', (req, res) => userController.saveThemeSuggestions(req, res));
userRouter.get('/user/:id/suggestions', (req, res) => userController.getUsersSuggestions(req, res));

export default userRouter;