import { Request, Response } from 'express';
import { fetchAllClubs, fetchClub, fetchClubEvents, fetchClubMembers, fetchUserClubs } from '../services/clubService.js';

export async function getAllClubs(req: Request, res: Response) {

    const universityId = parseInt(req.params.universityId, 10);

    try {
        const clubs = await fetchAllClubs(universityId);
        res.status(200).json(clubs);
    } 
    catch (err: any) {
        res.status(404).json({ message : "clubs not found" })
    }

}

export async function getUserClubs(req: Request, res: Response) {

    const userId = parseInt(req.params.userId, 10);

    try {
        const clubs = await fetchUserClubs(userId);
        res.status(200).json(clubs);
    }
    catch (err : any) {
        res.status(404).json({ message : "clubs not found" });
    }
}

export async function getClub(req: Request, res: Response) {

    const clubId = parseInt(req.params.clubId, 10);

    try {
        const club = await fetchClub(clubId);
        res.status(200).json(club[0]);
    }
    catch (err : any) {
        res.status(404).json({ message : "club not found" });
    }
}

export async function getClubMembers(req : Request, res : Response) {

    const clubId = parseInt(req.params.clubId, 10);

    try {
        const members = await fetchClubMembers(clubId);
        res.status(200).json(members);
    }
    catch (err : any) {
        res.status(404).json({ message : "members not found" })
    }
}

export async function getClubEvents(req : Request, res : Response) {

    const clubId = parseInt(req.params.clubId, 10);

    try {
        const events = await fetchClubEvents(clubId);
        res.status(200).json(events);
    }
    catch (err : any) {
        res.status(404).json({ message : "events not found" });
    }
}