import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routers/authRouter.js'; 
import { pool } from './config/database.js';

const app = express();
const PORT: number = 3000;

app.use(bodyParser.json());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.json({ message: "server is running" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
