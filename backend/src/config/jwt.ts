import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET as string;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const JWT_SECRET = 'iaminevitable!@#$%^&*()andiamironman';
const JWT_EXPIRES_IN = '1d';

export function generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}
