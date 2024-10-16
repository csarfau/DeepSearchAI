import { Router } from 'express';
import UserController from '../controllers/userController';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/user/:id', (req, res) => userController.test(req, res));
userRouter.post('/user/:id/themes', (req, res) => userController.saveThemeSuggestions(req, res));
userRouter.get('/user/:id/suggestions', (req, res) => userController.getUsersSuggestions(req, res));
userRouter.get('/themes', (req, res) => userController.getThemes(req, res));
userRouter.get('/user/:id/pages/suggestions', (req, res) => userController.getUsersPagesSuggetions(req, res));

export default userRouter;