import { Router } from 'express';
import { createClub, getAllClubs, getClub, getClubAnnouncementDiscussions, getClubAnnouncements, getClubEvents, getClubMembers, getUserClubs, joinClub, leaveClub } from '../controllers/clubController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const clubRouter = Router();

clubRouter.get('/university', authenticateToken, getAllClubs);
clubRouter.get('', authenticateToken, getUserClubs);
clubRouter.get('/club/:clubId', authenticateToken, getClub);
clubRouter.get('/club/:clubId/members', authenticateToken, getClubMembers);
clubRouter.get('/club/:clubId/events', getClubEvents); 
clubRouter.get('/club/:clubId/announcements', getClubAnnouncements); 
clubRouter.get('/club/:clubId/announcements/:announcementId', getClubAnnouncementDiscussions);
clubRouter.post('/join', authenticateToken, joinClub);
clubRouter.delete('/leave/:clubId', authenticateToken, leaveClub);
clubRouter.post('/create', authenticateToken, createClub);

export default clubRouter;
