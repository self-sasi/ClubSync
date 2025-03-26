import { pool } from '../config/database.js';

export async function getAllUniversity() {

    const [result] = await pool.query('SELECT * FROM University;');

    return result;
};