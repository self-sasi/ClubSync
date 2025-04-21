import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routers/authRouter.js'; 
import uniRouter from './routers/uniRouter.js'
import profileRouter from './routers/profileRouter.js';
import clubRouter from './routers/clubRouter.js';
import cors from 'cors';
import eventRouter from './routers/eventRouter.js';

const app = express();
const PORT: number = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/uni', uniRouter);
app.use('/api/profile', profileRouter);
app.use('/api/clubs', clubRouter);
app.use('/api/events', eventRouter);

app.get('/', (req, res) => {
    res.json({ message: "server is running" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
