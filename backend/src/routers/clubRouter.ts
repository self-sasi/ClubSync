import { Router } from 'express';
import { getAllClubs } from '../controllers/clubController.js';

const clubRouter = Router();

clubRouter.get('/:id', getAllClubs)

export default clubRouter;
