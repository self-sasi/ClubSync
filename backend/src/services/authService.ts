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

export async function loginUser(email: string, password: string) {
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

export async function verifyUser(userId : number) {

    const [result] = await pool.query('SELECT * From User WHERE UserId = ?', userId);
    const user : User = result[0];
    
    if (!user) {
        return new Error("User not found");
    } 

    const {Password, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

export async function updateUser(userId : number, userBody : any) {

    if (userId != userBody.UserId) throw new Error("User creds do not match");

    const result = await pool.query(
        `UPDATE User SET FirstName = ?, LastName = ?, Email = ?, Location = ?, UniversityId = ? WHERE UserId = ?`,
        [userBody.FirstName, userBody.LastName, userBody.Email, userBody.Location ?? null, userBody.UniversityId, userId]
      );

    return result;
}

export async function updatePassword(userId : number, passwordSet : any) {

    if (userId != passwordSet.UserId) throw new Error("User creds do not match");

    const [rows]: any = await pool.query(`SELECT Password FROM User WHERE UserId = ?`, [userId]);
    const storedPassword = rows[0]?.Password;
    const isMatch = await bcrypt.compare(passwordSet.old, storedPassword);

    if (!isMatch) throw new Error("Passwords do not match");

    const newPassword = await bcrypt.hash(passwordSet.new, 10);
    const result = await pool.query(
        `UPDATE User SET Password = ? WHERE UserId = ?`, [newPassword, userId]
    );

    return result;
}
