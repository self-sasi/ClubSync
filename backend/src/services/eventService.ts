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
