import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import { User } from '../types/user.js';

export async function registerUser(user: User) {

    const hashedPassword = await bcrypt.hash(user.Password, 10);

    const query = `
        INSERT INTO User (FirstName, LastName, Email, Password, Location, UniversityId)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
        user.FirstName,
        user.LastName,
        user.Email,
        hashedPassword,
        user.Location || null,
        user.UniversityId,
    ]);

    return result;
}

export async function loginUser(email: string, password: string): Promise<Omit<User, 'Password'>> {
    const [rows]: any = await pool.query(`SELECT * FROM User WHERE Email = ?`, [email]);

    if (rows.length === 0) {
        throw new Error("User not found");
    }

    const user: User = rows[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
        throw new Error("Invalid password");
    }

    const { Password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
