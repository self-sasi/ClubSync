import { Request, Response } from 'express';
import { fetchProfile } from '../services/profileService.js';
import { AuthenticatedRequest } from '../types/authenticatedRequest.js';

export async function getProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User ID not found in token' });
    }

    try {
        const userProfile = await fetchProfile(userId);
        res.status(200).json(userProfile[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}