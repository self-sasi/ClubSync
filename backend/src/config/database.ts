import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

// export const pool = mysql.createPool({
//     host : process.env.DATABASE_HOST,
//     user : process.env.DATABASE_USER,
//     password : process.env.DATABASE_PASSWORD,
//     database : process.env.DATABASE_NAME
// }).promise();

export const pool = mysql.createPool({
    host : '127.0.0.1',
    user : 'root',
    password : 'GITHUBleetcode**05',
    database : 'ClubSync'
}).promise();