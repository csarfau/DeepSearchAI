import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'express-async-errors';
import { json } from 'body-parser';
import router from './routes/routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();
const app = express();
app.use(cors());

app.use(json());
app.use('/api', router);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});