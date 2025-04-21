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
  
export async function fetchEvent(eventId: number, userId: number): Promise<EventWithRSVP | null> {
    const [rows] = await pool.query<EventWithRSVP[]>(
        `
        SELECT 
        e.*, 
        r.UserId IS NOT NULL AS IsRSVPed
        FROM Event e
        LEFT JOIN RSVP r ON r.EventId = e.EventId AND r.UserId = ?
        WHERE e.EventId = ?
        `,
    [userId, eventId]
);

return rows.length > 0 ? rows[0] : null;
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
  ) {
    await pool.query(
      `INSERT INTO Event (ClubId, Name, EventDate, Location, Status)
       VALUES (?, ?, ?, ?, ?);`,
      [clubId, name, eventDate, location, status]
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

