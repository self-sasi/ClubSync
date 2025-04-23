import { ResultSetHeader } from 'mysql2';
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

export async function fetchClub(clubId: number) {
    const [rows] = await pool.query(
        `SELECT 
           c.*, 
           (SELECT COUNT(*) FROM ClubMember cm WHERE cm.ClubId = c.ClubId) AS MemberCount
         FROM Club c
         WHERE c.ClubId = ?;`,
        [clubId]
    );

    return rows[0];
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
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (?, ?, CURDATE());",
        [userId, clubId]
    );

    const memberId = result.insertId;

    await pool.query(
        "INSERT INTO ClubNormalMember (MemberId, ClubId) VALUES (?, ?);",
        [memberId, clubId]
    );
}


type MemberRow = { MemberId: number };

export async function unRegisterUserInClub(userId: number, clubId: number) {
    const [rows] = await pool.query(
      "SELECT MemberId FROM ClubMember WHERE UserId = ? AND ClubId = ?;",
      [userId, clubId]
    ) as unknown as [MemberRow[]];
  
    if (!rows.length) return;
    const memberId = rows[0].MemberId;
  
    const [messageRows] = await pool.query(
      "SELECT MessageId FROM Message WHERE ClubMemberId = ?;",
      [memberId]
    ) as any;
  
    const messageIds = messageRows.map((row: any) => row.MessageId);
  
    if (messageIds.length > 0) {
      const placeholders = messageIds.map(() => '?').join(',');
      await pool.query(
        `DELETE FROM Comment WHERE MessageId IN (${placeholders});`,
        [...messageIds]
      );
    }
  
    await pool.query("DELETE FROM Message WHERE ClubMemberId = ?;", [memberId]);
  
    const [eventRows] = await pool.query(
      "SELECT EventId FROM Event WHERE ClubId = ?;",
      [clubId]
    ) as any;
  
    const eventIds = eventRows.map((row: any) => row.EventId);
  
    if (eventIds.length > 0) {
      const placeholders = eventIds.map(() => '?').join(',');
      await pool.query(
        `DELETE FROM Manages WHERE MemberId = ? AND EventId IN (${placeholders});`,
        [memberId, ...eventIds]
      );
    }
  
    await pool.query("DELETE FROM ClubNormalMember WHERE MemberId = ? AND ClubId = ?;", [memberId, clubId]);
    await pool.query("DELETE FROM ClubAdmin WHERE MemberId = ? AND ClubId = ?;", [memberId, clubId]);
  
    await pool.query("DELETE FROM ClubMember WHERE MemberId = ?;", [memberId]);
  }
  

export async function fetchClubUsers(clubId: number) {
    const [users] = await pool.query(
        `SELECT 
            u.UserId,
            u.FirstName,
            u.LastName,
            u.Email,
            cm.MemberId,
            cm.DateJoined,
            CASE 
                WHEN ca.MemberId IS NOT NULL THEN 'Admin'
                WHEN cnm.MemberId IS NOT NULL THEN 'Normal'
                ELSE 'Unknown'
            END AS Role
        FROM ClubMember cm
        JOIN User u ON u.UserId = cm.UserId
        LEFT JOIN ClubAdmin ca ON ca.MemberId = cm.MemberId AND ca.ClubId = ?
        LEFT JOIN ClubNormalMember cnm ON cnm.MemberId = cm.MemberId AND cnm.ClubId = ?
        WHERE cm.ClubId = ?;`,
        [clubId, clubId, clubId]
    );

    return users;
}

export async function registerNewClub(userId: number, clubName: string, description: string) {
    const [userRows] = await pool.query(
        "SELECT UniversityId FROM User WHERE UserId = ?;",
        [userId]
    ) as unknown as [{ UniversityId: number }[]];

    if (!userRows.length) {
        throw new Error("User not found or university ID missing.");
    }

    const universityId = userRows[0].UniversityId;

    const [clubResult] = await pool.query<ResultSetHeader>(
        "INSERT INTO Club (ClubName, Description, CreationDate, UniversityId) VALUES (?, ?, CURDATE(), ?);",
        [clubName, description, universityId]
    );

    const clubId = clubResult.insertId;

    const [memberResult] = await pool.query<ResultSetHeader>(
        "INSERT INTO ClubMember (UserId, ClubId, DateJoined) VALUES (?, ?, CURDATE());",
        [userId, clubId]
    );

    const memberId = memberResult.insertId;

    await pool.query(
        "INSERT INTO ClubAdmin (MemberId, ClubId) VALUES (?, ?);",
        [memberId, clubId]
    );

    return { clubId };
}

export async function removeMember(targetMemberId: number, clubId: number) {
    await pool.query('DELETE FROM ClubNormalMember WHERE MemberId = ? AND ClubId = ?;', [targetMemberId, clubId]);
    await pool.query('DELETE FROM ClubAdmin WHERE MemberId = ? AND ClubId = ?;', [targetMemberId, clubId]);
    await pool.query('DELETE FROM ClubMember WHERE MemberId = ? AND ClubId = ?;', [targetMemberId, clubId]);
  }
  
export async function promoteMemberToAdmin(targetMemberId: number, clubId: number) {
await pool.query(
    'DELETE FROM ClubNormalMember WHERE MemberId = ? AND ClubId = ?;',
    [targetMemberId, clubId]
);

await pool.query(
    'INSERT INTO ClubAdmin (MemberId, ClubId) VALUES (?, ?);',
    [targetMemberId, clubId]
);
}

export async function updateClubDetails(clubId: number, clubName: string, description: string) {
    await pool.query(
      `UPDATE Club SET ClubName = ?, Description = ? WHERE ClubId = ?`,
      [clubName, description, clubId]
    );
  }
