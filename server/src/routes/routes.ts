import { Router } from 'express';
import userRouter from './userRouter';
import searchRouter from './searchRouter';

const router = Router();

router.use(userRouter);
router.use(searchRouter);

export default router;
