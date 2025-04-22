import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest.js';
import { isUserClubAdmin, isUserInClub } from '../helpers/clubHelpers.js';
import { createAnnouncement, fetchClubAnnouncements } from '../services/announcementService.js';

export async function getClubAnnouncements(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const clubId = parseInt(req.params.clubId, 10);

  if (!userId || isNaN(clubId)) {
    return res.status(400).json({ message: 'Missing or invalid parameters' });
  }

  const isMember = await isUserInClub(userId, clubId);
  if (!isMember) {
    return res.status(403).json({ message: 'Access denied: not a member of this club' });
  }

  try {
    const announcements = await fetchClubAnnouncements(clubId);
    res.status(200).json(announcements);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: err.message });
  }
}

export async function createAnnouncementHandler(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { clubId, eventId, content } = req.body;

  if (!userId || !clubId || !eventId || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const isMember = await isUserInClub(userId, clubId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: not a club member' });
    }

    const isAdmin = await isUserClubAdmin(userId, clubId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only club admins can post announcements' });
    }

    await createAnnouncement(clubId, eventId, content);
    res.status(201).json({ message: 'Announcement created successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create announcement', error: err.message });
  }
}

