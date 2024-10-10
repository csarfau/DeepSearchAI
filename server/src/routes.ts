import { Router } from 'express';
import UserController from './controllers/authController';
import UserRepository from './repositories/userRepository';
import 'express-async-errors';

const router = Router();

const userRepository = new UserRepository(); 
const userController = new UserController(userRepository);

router.post('/register', (req, res) => userController.register(req, res));

export default router;
