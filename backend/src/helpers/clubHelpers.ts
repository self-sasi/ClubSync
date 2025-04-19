import { pool } from '../config/database.js';

export async function isUserInClub(userId: number, clubId: number): Promise<boolean> {
    const [rows] = await pool.query(
        "SELECT 1 FROM ClubMember WHERE UserId = ? AND ClubId = ? LIMIT 1;",
        [userId, clubId]
    );

    return Array.isArray(rows) && rows.length > 0;
}

