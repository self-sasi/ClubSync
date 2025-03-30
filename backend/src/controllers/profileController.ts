import { Request, Response } from 'express';
import { fetchProfile } from '../services/profileService.js';

export async function getProfile(req: Request, res: Response) {

    const userId = parseInt(req.params.id, 10);

    try {
        const userProfile = await fetchProfile(userId);
        res.status(200).json(userProfile[0]);
    }
    catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}