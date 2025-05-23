import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest.js';
import { isUserClubAdmin, isUserInClub } from '../helpers/clubHelpers.js';
import { assignEventManagers, cancelRsvpToEvent, createEvent, fetchEvent, fetchUserEvents, getUserRSVPEvents, rsvpToEvent } from '../services/eventService.js';

export async function getEvent(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const eventId = parseInt(req.params.eventId, 10);
  
    if (!userId || isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid user or event ID" });
    }
  
    try {
      const event = await fetchEvent(eventId, userId);
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      const isMember = await isUserInClub(userId, event.ClubId);
      if (!isMember) {
        return res.status(403).json({ message: "Access denied: not a member of this club" });
      }
  
      res.status(200).json(event);
    } catch (err: any) {
      res.status(500).json({ message: "Could not fetch event", error: err.message });
    }
  }

  export async function rsvpEvent(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const eventId = parseInt(req.params.eventId, 10);
  
    if (!userId || isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid user or event ID" });
    }
  
    try {
      const event = await fetchEvent(eventId, userId);
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      const isMember = await isUserInClub(userId, event.ClubId);
      if (!isMember) {
        return res.status(403).json({ message: "Access denied: not a member of this club" });
      }
  
      await rsvpToEvent(userId, eventId);
      res.status(200).json({ message: "RSVP successful" });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to RSVP", error: err.message });
    }
  }
  
  export async function cancelRsvpEvent(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const eventId = parseInt(req.params.eventId, 10);
  
    if (!userId || isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid user or event ID" });
    }
  
    try {
      const event = await fetchEvent(eventId, userId);
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      const isMember = await isUserInClub(userId, event.ClubId);
      if (!isMember) {
        return res.status(403).json({ message: "Access denied: not a member of this club" });
      }
  
      await cancelRsvpToEvent(userId, eventId);
      res.status(200).json({ message: "RSVP cancelled" });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to cancel RSVP", error: err.message });
    }
  }

  export async function createEventHandler(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const { clubId, name, eventDate, location, managerIds } = req.body;
  
    if (!userId || !clubId || !name || !eventDate || !location) {
      return res.status(400).json({ message: 'Missing required event fields' });
    }
  
    try {
      const isMember = await isUserInClub(userId, clubId);
      if (!isMember) {
        return res.status(403).json({ message: 'Access denied: not a member of this club' });
      }
  
      const eventId = await createEvent(clubId, name, eventDate, location);
  
      if (Array.isArray(managerIds)) {
        await assignEventManagers(eventId, managerIds);
      }
  
      res.status(201).json({ message: 'Event created successfully' });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to create event', error: err.message });
    }
  }
  

  export async function getUserEvents(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const events = await fetchUserEvents(userId);
        res.status(200).json(events);
    } catch (err: any) {
        res.status(500).json({ message: "Could not fetch events", error: err.message });
    }
}

export async function getUserRSVPEventsController(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const events = await getUserRSVPEvents(userId);
    res.status(200).json(events);
  } catch (err: any) {
    res.status(500).json({ message: "Could not fetch RSVP'd events", error: err.message });
  }
}