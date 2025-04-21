import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { cancelRsvpEvent, createEventHandler, getEvent, rsvpEvent } from '../controllers/eventController.js';

const eventRouter = Router();

eventRouter.get('/event/:eventId', authenticateToken, getEvent);
eventRouter.post('/event/:eventId/rsvp', authenticateToken, rsvpEvent);
eventRouter.delete('/event/:eventId/rsvp', authenticateToken, cancelRsvpEvent);
eventRouter.post('/event/create', authenticateToken, createEventHandler);

export default eventRouter;