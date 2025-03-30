import { pool } from '../config/database.js';

export async function fetchProfile(id : number) {
    const [result] = await pool.query("SELECT * FROM User WHERE User.UserId = ?", id);
    return result;
}
