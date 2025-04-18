import { Router } from 'express';
import { getAllClubs, getClub, getClubAnnouncementDiscussions, getClubAnnouncements, getClubEvents, getClubMembers, getUserClubs } from '../controllers/clubController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const clubRouter = Router();

clubRouter.get('/university/:universityId', getAllClubs);
clubRouter.get('', authenticateToken, getUserClubs);
clubRouter.get('/club/:clubId', getClub);
clubRouter.get('/club/:clubId/members', getClubMembers);
clubRouter.get('/club/:clubId/events', getClubEvents); 
clubRouter.get('/club/:clubId/announcements', getClubAnnouncements); 
clubRouter.get('/club/:clubId/announcements/:announcementId', getClubAnnouncementDiscussions);

export default clubRouter;
