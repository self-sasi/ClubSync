import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getClubAnnouncements } from '../controllers/announcementController.js';

const announcementRouter = Router();

announcementRouter.get('/club/:clubId', authenticateToken, getClubAnnouncements);

export default announcementRouter;