import { Request, Response } from 'express';
import { fetchAllClubs } from '../services/clubService.js';

export async function getAllClubs(req: Request, res: Response) {

    const universityId = parseInt(req.params.id, 10);

    try {
        const clubs = await fetchAllClubs(universityId);
        res.status(200).json(clubs);
    } 
    catch (err: any) {
        res.status(404).json({ message : "clubs not found" })
    }

}