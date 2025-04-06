import { Request, Response } from 'express';
import { registerUser, loginUser, verifyUser, updateUser, updatePassword } from '../services/authService.js';
import { User } from '../types/user.js';
import { generateToken } from '../config/jwt.js';
import { AuthenticatedRequest } from '../types/authenticatedRequest.js';

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
        const token = generateToken(user.UserId);
        res.status(200).json({ token, user });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}

export async function verify(req : AuthenticatedRequest, res : Response) {
    const userId = req.user.userId;

    try {
        const user = await verifyUser(userId);
        res.status(200).json(user);
    } catch (err : any) {
        res.status(401).json({ error: err.message });
    }
}

export async function update(req : AuthenticatedRequest, res : Response) {
    const userId = req.user.userId;
    const user = req.body;

    try {
        const result = await updateUser(userId, user);
        res.sendStatus(204);
    } catch (err : any) {
        res.status(401).json({ error: err.message });
    }
}

export async function changePassword(req : AuthenticatedRequest, res : Response) {
    const userId = req.user.userId;
    const passwordSet = req.body;

    try {
        const result = await updatePassword(userId, passwordSet);
        res.sendStatus(204);
    } catch (err : any) {
        res.status(401).json({ error : err.message })
    }
}
