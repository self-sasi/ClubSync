import { Router } from 'express';
import { getAllClubs, getClub, getClubMembers, getUserClubs } from '../controllers/clubController.js';

const clubRouter = Router();

clubRouter.get('/university/:universityId', getAllClubs);
clubRouter.get('/user/:userId', getUserClubs);
clubRouter.get('/club/:clubId', getClub);
clubRouter.get('/club/:clubId/members', getClubMembers);

export default clubRouter;
