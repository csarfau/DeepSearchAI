import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import { json } from 'body-parser';
import Router from './routes/routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

app.use(json());
app.use('/api', Router);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT);