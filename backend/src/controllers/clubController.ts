import { Request, Response } from 'express';
import { fetchAllClubs, fetchClub, fetchClubAnnouncementDiscussions, fetchClubAnnouncements, fetchClubEvents, fetchClubMembers, fetchUserClubs, registerUserInClub, unRegisterUserInClub } from '../services/clubService.js';
import { AuthenticatedRequest } from '../types/authenticatedRequest.js';
import { isUserInClub } from '../helpers/clubHelpers.js';

export async function getAllClubs(req: AuthenticatedRequest, res: Response) {

    const userId = req.user?.userId;

    try {
        const clubs = await fetchAllClubs(userId);
        res.status(200).json(clubs);
    } 
    catch (err: any) {
        res.status(404).json({ message : "clubs not found" })
    }

}

export async function getUserClubs(req: AuthenticatedRequest, res: Response) {

    const userId = req.user?.userId;

    try {
        const clubs = await fetchUserClubs(userId);
        res.status(200).json(clubs);
    }
    catch (err : any) {
        res.status(404).json({ message : "clubs not found" });
    }
}

export async function getClub(req: AuthenticatedRequest, res: Response) {

    const userId = req.user?.userId;
    const clubId = parseInt(req.params.clubId, 10);

    try {
        const isMember = await isUserInClub(userId, clubId);
        if (!isMember) {
            return res.status(403).json({ message: "Access denied: not a member of this club" });
        }
        
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

export async function getClubAnnouncements(req : Request, res : Response) {

    const clubId = parseInt(req.params.clubId, 10);

    try {
        const announcements = await fetchClubAnnouncements(clubId);
        res.status(200).json(announcements);
    }
    catch (err : any) {
        res.status(404).json({ message : "announcements not found" })
    }
}

export async function getClubAnnouncementDiscussions(req : Request, res : Response) {

    const clubId = parseInt(req.params.clubId, 10);
    const announcementId = parseInt(req.params.announcementId, 10);

    try {
        const discussions = await fetchClubAnnouncementDiscussions(announcementId);
        res.status(200).json(discussions);
    }
    catch (err : any) {
        res.status(404).json({ message : "announcement discussions not found"} );
    }
}

export async function joinClub(req : AuthenticatedRequest, res : Response) {

    const userId = req.user?.userId;
    const { clubId } = req.body;

    if (!userId || !clubId) {
        return res.status(400).json({ message: "Missing userId or clubId" });
    }

    try {
        await registerUserInClub(userId, clubId); 
        res.status(200).json({ message: "User successfully joined the club" });
    } catch (err: any) {
        res.status(500).json({ message: "Could not join club", error: err.message });
    }
}


export async function leaveClub(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const clubId = parseInt(req.params.clubId, 10);

    if (!userId || isNaN(clubId)) {
        return res.status(400).json({ message: "Missing or invalid clubId" });
    }

    try {
        await unRegisterUserInClub(userId, clubId);
        res.status(200).json({ message: "User successfully left the club" });
    } catch (err: any) {
        res.status(500).json({ message: "Could not leave club", error: err.message });
    }
}
