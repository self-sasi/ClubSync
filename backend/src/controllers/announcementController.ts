import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest.js';
import { isUserInClub } from '../helpers/clubHelpers.js';
import { fetchClubAnnouncements } from '../services/announcementService.js';

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

