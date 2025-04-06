import { Router } from 'express';
import { login, signup, update, verify } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/validate', authenticateToken, verify);
authRouter.put('/', authenticateToken, update);

export default authRouter;
