import { Router } from 'express';
import { getUniversities } from '../controllers/universityController.js';

const uniRouter = Router();

uniRouter.get('/', getUniversities);

export default uniRouter;
