import { Router } from 'express';
import UserController from '../controllers/userController';
import UserRepository from '../repositories/userRepository';
import { db } from '../database/knex';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter = Router();

const userRepository = new UserRepository(db); 
const userController = new UserController(userRepository);

userRouter.post('/login', (req, res) => userController.login(req, res));
userRouter.post('/user', (req, res) => userController.createUser(req, res));

userRouter.use(authMiddleware);
userRouter.get('/user/:id', (req, res) => userController.test(req, res));
userRouter.post('/user/:id/themes', (req, res) => userController.saveThemeSuggestions(req, res));
userRouter.get('/user/:id/suggestions', (req, res) => userController.getUsersSuggestions(req, res));
userRouter.get('/themes', (req, res) => userController.getThemes(req, res));

export default userRouter;