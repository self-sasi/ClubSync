import { Router } from 'express';
import { createClub, getAllClubs, getClub, getClubEvents, getClubMembers, getUserClubs, joinClub, leaveClub, makeClubAdmin, removeMemberFromClub } from '../controllers/clubController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const clubRouter = Router();

clubRouter.get('/university', authenticateToken, getAllClubs);
clubRouter.get('', authenticateToken, getUserClubs);
clubRouter.get('/club/:clubId', authenticateToken, getClub);
clubRouter.get('/club/:clubId/members', authenticateToken, getClubMembers);
clubRouter.get('/club/:clubId/events', authenticateToken, getClubEvents); 
clubRouter.post('/join', authenticateToken, joinClub);
clubRouter.delete('/leave/:clubId', authenticateToken, leaveClub);
clubRouter.post('/create', authenticateToken, createClub);
clubRouter.delete('/member/:memberId/:clubId', authenticateToken, removeMemberFromClub);
clubRouter.put('/promote/:memberId/:clubId', authenticateToken, makeClubAdmin);

export default clubRouter;
