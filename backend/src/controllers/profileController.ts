import { Request, Response } from 'express';
import { fetchProfile } from '../services/profileService.js';

export async function getProfile(req: Request, res: Response) {

    const UserId = parseInt(req.params.id, 10);

    try {
        const userProfile = await fetchProfile(UserId);
        res.status(200).json({ message: "Query Successful", userProfile });
    }
    catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}