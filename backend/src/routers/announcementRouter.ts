import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createAnnouncementHandler, createDiscussionChannelHandler, getClubAnnouncements, postMessageController } from '../controllers/announcementController.js';

const announcementRouter = Router();

announcementRouter.get('/club/:clubId', authenticateToken, getClubAnnouncements);
announcementRouter.post('/create', authenticateToken, createAnnouncementHandler);
announcementRouter.post('/discussion/create', authenticateToken, createDiscussionChannelHandler);
announcementRouter.post('/discussion/message', authenticateToken, postMessageController);

export default announcementRouter;