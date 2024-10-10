import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import { json } from 'body-parser';
import authRoutes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

app.use(json());
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT);