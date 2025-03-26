import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.js';
import { User } from '../types/user.js';

export async function signup(req: Request, res: Response) {
    const user: User = req.body;
    try {
        await registerUser(user);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function login(req: Request, res: Response) {
    const { Email, Password } = req.body;

    try {
        const user = await loginUser(Email, Password);
        res.status(200).json({ message: "Login successful", user });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}
