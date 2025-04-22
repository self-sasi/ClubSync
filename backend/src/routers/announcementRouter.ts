import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createAnnouncementHandler, getClubAnnouncements } from '../controllers/announcementController.js';

const announcementRouter = Router();

announcementRouter.get('/club/:clubId', authenticateToken, getClubAnnouncements);
announcementRouter.post('/create', authenticateToken, createAnnouncementHandler);

export default announcementRouter;