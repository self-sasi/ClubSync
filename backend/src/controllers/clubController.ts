import { Request, Response } from 'express';
import { fetchAllClubs, fetchClub, fetchClubAnnouncementDiscussions, fetchClubAnnouncements, fetchClubEvents, fetchClubMembers, fetchUserClubs, promoteMemberToAdmin, registerNewClub, registerUserInClub, removeMember, unRegisterUserInClub } from '../services/clubService.js';
import { AuthenticatedRequest } from '../types/authenticatedRequest.js';
import { isUserClubAdmin, isUserInClub } from '../helpers/clubHelpers.js';

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
        const isAdmin = await isUserClubAdmin(userId, clubId);

        res.status(200).json({ ...club, IsAdmin: isAdmin });
        console.log({...club, IsAdmin: isAdmin})
    } catch (err: any) {
        res.status(404).json({ message: "Club not found" });
    }
}

export async function getClubMembers(req : AuthenticatedRequest, res : Response) {

    const userId = req.user?.userId;
    const clubId = parseInt(req.params.clubId, 10);

    try {
        const isMember = await isUserInClub(userId, clubId);
        if (!isMember) {
            return res.status(403).json({ message: "Access denied: not a member of this club" });
        }
        const members = await fetchClubMembers(clubId);
        res.status(200).json(members);
        console.log(members)
    }
    catch (err : any) {
        res.status(404).json({ message : "members not found" })
    }
}

export async function getClubEvents(req : AuthenticatedRequest, res : Response) {

    const clubId = parseInt(req.params.clubId, 10);
    const userId = req.user.userId;

    const isMember = await isUserInClub(userId, clubId);
    if (!isMember) {
        return res.status(403).json({ message: "Access denied: not a member of this club" });
    }

    try {
        const events = await fetchClubEvents(clubId);
        res.status(200).json(events);
    }
    catch (err : any) {
        res.status(404).json({ message : "events not found" });
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

export async function createClub(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const { clubName, description } = req.body;

    if (!userId || !clubName || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const { clubId } = await registerNewClub(userId, clubName, description);
        res.status(201).json({ message: "Club created successfully", clubId });
    } catch (err: any) {
        res.status(500).json({ message: "Failed to create club", error: err.message });
    }
}

export async function removeMemberFromClub(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const memberId = parseInt(req.params.memberId, 10);
    const clubId = parseInt(req.params.clubId, 10);
  
    if (!userId || isNaN(memberId) || isNaN(clubId)) {
      return res.status(400).json({ message: "Missing or invalid parameters" });
    }

    const isMember = await isUserInClub(userId, clubId);
    if (!isMember) {
        return res.status(403).json({ message: "Access denied: not a member of this club" });
    }
  
    const isAdmin = await isUserClubAdmin(userId, clubId);
    if (!isAdmin) {
      return res.status(403).json({ message: "Only club admins can remove members" });
    }
  
    try {
      await removeMember(memberId, clubId);
      res.status(200).json({ message: "Member removed successfully" });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to remove member", error: err.message });
    }
}

export async function makeClubAdmin(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const memberId = parseInt(req.params.memberId, 10);
    const clubId = parseInt(req.params.clubId, 10);
  
    if (!userId || isNaN(memberId) || isNaN(clubId)) {
      return res.status(400).json({ message: "Missing or invalid parameters" });
    }
    const isMember = await isUserInClub(userId, clubId);
    if (!isMember) {
        return res.status(403).json({ message: "Access denied: not a member of this club" });
    }
  
    const isAdmin = await isUserClubAdmin(userId, clubId);
    if (!isAdmin) {
      return res.status(403).json({ message: "Only club admins can promote members" });
    }
  
    try {
      await promoteMemberToAdmin(memberId, clubId);
      res.status(200).json({ message: "Member promoted to admin" });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to promote member", error: err.message });
    }
  }
  
