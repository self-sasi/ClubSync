import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createAnnouncementHandler, createDiscussionChannelHandler, getClubAnnouncements, postCommentController, postMessageController } from '../controllers/announcementController.js';

const announcementRouter = Router();

announcementRouter.get('/club/:clubId', authenticateToken, getClubAnnouncements);
announcementRouter.post('/create', authenticateToken, createAnnouncementHandler);
announcementRouter.post('/discussion/create', authenticateToken, createDiscussionChannelHandler);
announcementRouter.post('/discussion/message', authenticateToken, postMessageController);
announcementRouter.post('/discussion/comment', authenticateToken, postCommentController);

export default announcementRouter;