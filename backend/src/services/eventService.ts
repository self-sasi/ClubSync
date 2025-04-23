import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';

interface EventWithRSVP extends RowDataPacket {
    EventId: number;
    ClubId: number;
    Name: string;
    EventDate: string;
    Location: string;
    Status: string;
    IsRSVPed: number;
  }

  
  export async function fetchEvent(eventId: number, userId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        e.*, 
        r.UserId IS NOT NULL AS IsRSVPed
       FROM Event e
       LEFT JOIN RSVP r ON r.EventId = e.EventId AND r.UserId = ?
       WHERE e.EventId = ?`,
      [userId, eventId]
    );
  
    if (rows.length === 0) return null;
  
    const event = rows[0] as EventWithRSVP;
  
    const [managerRows] = await pool.query<RowDataPacket[]>(
      `SELECT CONCAT(u.FirstName, ' ', u.LastName) AS ManagerName
       FROM Manages m
       JOIN ClubMember cm ON m.MemberId = cm.MemberId
       JOIN User u ON u.UserId = cm.UserId
       WHERE m.EventId = ?`,
      [eventId]
    );
  
    const managers = managerRows.map(row => (row as any).ManagerName);
  
    return {
      ...event,
      Managers: managers
    };
  }
  

export async function rsvpToEvent(userId: number, eventId: number) {
    await pool.query(
      'INSERT INTO RSVP (UserId, EventId) VALUES (?, ?);',
      [userId, eventId]
    );
  }
  
export async function cancelRsvpToEvent(userId: number, eventId: number) {
    await pool.query(
        'DELETE FROM RSVP WHERE UserId = ? AND EventId = ?;',
        [userId, eventId]
);
}

export async function createEvent(
  clubId: number,
  name: string,
  eventDate: string,
  location: string,
  status: string = 'Scheduled'
): Promise<number> {
  const [result]: any = await pool.query(
    `INSERT INTO Event (ClubId, Name, EventDate, Location, Status)
     VALUES (?, ?, ?, ?, ?)`,
    [clubId, name, eventDate, location, status]
  );

  return result.insertId; 
}

export async function assignEventManagers(eventId: number, memberIds: number[]) {
  if (!Array.isArray(memberIds)) return;

  const insertValues = memberIds.map(memberId => [memberId, eventId]);

  await pool.query(
    `INSERT INTO Manages (MemberId, EventId)
     VALUES ?`,
    [insertValues]
  );
}


export async function fetchUserEvents(userId: number) {
  const [events] = await pool.query(
    `SELECT 
       e.EventId,
       e.Name,
       e.Location,
       e.EventDate,
       e.Status,
       e.ClubId,
       c.ClubName
     FROM Event e
     JOIN Club c ON e.ClubId = c.ClubId
     WHERE e.ClubId IN (
       SELECT ClubId FROM ClubMember WHERE UserId = ?
     )`,
    [userId]
  );
  return events;
}

export async function getUserRSVPEvents(userId: number) {
  const [rows] = await pool.query(
    `
    SELECT 
      e.EventId,
      e.Name,
      e.EventDate,
      e.Location,
      e.Status,
      c.ClubId,
      c.ClubName
    FROM RSVP r
    JOIN Event e ON e.EventId = r.EventId
    JOIN Club c ON c.ClubId = e.ClubId
    WHERE r.UserId = ?;
    `,
    [userId]
  );

  return rows;
}

