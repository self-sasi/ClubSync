import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const profileRouter = Router();

profileRouter.get('/', authenticateToken, getProfile);

export default profileRouter;