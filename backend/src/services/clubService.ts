import { pool } from '../config/database.js';

export async function fetchAllClubs(universityId : number) {
    const [clubs] = await pool.query("SELECT * FROM Club WHERE Club.UniversityId = ?", universityId);
    return clubs;
}
