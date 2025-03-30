import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';

const profileRouter = Router();

profileRouter.get('/:id', getProfile)

export default profileRouter;