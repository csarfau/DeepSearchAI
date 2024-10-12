import { Router } from 'express';
import UserController from '../controllers/authController';
import UserRepository from '../repositories/userRepository';
import { db } from '../database/knex';

const userRouter = Router();

const userRepository = new UserRepository(db); 
const userController = new UserController(userRepository);

userRouter.get('/user/:id', (req, res) => userController.test(req, res));
// userRouter.post('/user/:id/suggestions', (req, res) => userController.register(req, res));

export default userRouter;