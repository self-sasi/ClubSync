import { pool } from '../config/database.js';

export async function isUserInClub(userId: number, clubId: number): Promise<boolean> {
    const [rows] = await pool.query(
        "SELECT 1 FROM ClubMember WHERE UserId = ? AND ClubId = ? LIMIT 1;",
        [userId, clubId]
    );

    return Array.isArray(rows) && rows.length > 0;
}

export async function isUserClubAdmin(userId: number, clubId: number): Promise<boolean> {
    const [rows] = await pool.query(
        `SELECT 1 
         FROM ClubAdmin ca
         JOIN ClubMember cm ON ca.MemberId = cm.MemberId
         WHERE cm.UserId = ? AND ca.ClubId = ? LIMIT 1;`,
        [userId, clubId]
    );

    return Array.isArray(rows) && rows.length > 0;
}

export async function getClubMemberId(userId: number, clubId: number): Promise<number> {
    const [rows]: any = await pool.query(
      `SELECT MemberId FROM ClubMember WHERE UserId = ? AND ClubId = ?`,
      [userId, clubId]
    );
  
    if (rows.length === 0) {
      throw new Error("User is not a member of this club");
    }
  
    return rows[0].MemberId;
  }
