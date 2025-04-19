import { pool } from '../config/database.js';

export async function fetchAllClubs(userId: number) {
    const [clubs] = await pool.query(
        `SELECT 
            c.ClubId,
            c.ClubName,
            c.Description,
            c.CreationDate,
            cm.MemberId IS NOT NULL AS IsMember
        FROM Club c
        INNER JOIN User u ON c.UniversityId = u.UniversityId
        LEFT JOIN ClubMember cm ON cm.ClubId = c.ClubId AND cm.UserId = u.UserId
        WHERE u.UserId = ?;`,
        [userId]
    );
    return clubs;
}

export async function fetchUserClubs(userId : number) {
    const [clubs] = await pool.query("SELECT * FROM Club WHERE ClubId IN (SELECT ClubId FROM ClubMember WHERE UserId = ?);", userId);
    return clubs;
}

export async function fetchClub(clubId : number) {
    const [club] = await pool.query("SELECT * FROM Club WHERE ClubId = ? ;", clubId);
    return club;
}

export async function fetchClubMembers(clubId : number) {
    const [normalMembers] = await pool.query("SELECT User.FirstName, User.LastName, ClubMember.MemberId, ClubMember.DateJoined FROM ClubMember JOIN User ON User.UserId = ClubMember.UserId WHERE ClubMember.MemberId IN (SELECT MemberId FROM ClubNormalMember WHERE ClubNormalMember.ClubId = ?);", clubId);
    const [adminMembers] = await pool.query("SELECT User.FirstName, User.LastName, ClubMember.MemberId, ClubMember.DateJoined FROM ClubMember JOIN User ON User.UserId = ClubMember.UserId WHERE ClubMember.MemberId IN (SELECT MemberId FROM ClubAdmin WHERE ClubAdmin.ClubId = ?);", clubId);

    return {
        normal : normalMembers,
        admin : adminMembers,
    }
}

export async function fetchClubEvents(clubId : number) {
    const [events] = await pool.query("SELECT * FROM EVENT WHERE EVENT.ClubId = ?;", clubId);
    return events;
}

export async function fetchClubAnnouncements(clubId : number) {
    const [announcements] = await pool.query("SELECT * FROM Announcement WHERE ClubId = ?;", clubId);
    return announcements;
}

export async function fetchClubAnnouncementDiscussions(announcemendId : number) {
    const [discussions] = await pool.query("SELECT * FROM DiscussionChannel WHERE AnnouncementId = ?;", announcemendId);
    return discussions;
}

export async function registerUserInClub(userId: number, clubId: number) {
    await pool.query(
        "INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (?, ?, CURDATE());",
        [userId, clubId]
    );
}

export async function unRegisterUserInClub(userId: number, clubId: number) {
    await pool.query(
        "DELETE FROM ClubMember WHERE UserId = ? AND ClubId = ?;",
        [userId, clubId]
    );
}
