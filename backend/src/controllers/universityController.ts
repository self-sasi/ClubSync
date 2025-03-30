import { fetchAllUniversities } from "../services/universityService.js";
import { Request, Response } from 'express';

export async function getUniversities(req: Request, res: Response) {
    try {
        const universities = await fetchAllUniversities();
        res.status(200).json({ message: "Query Successful", universities });
    }
    catch (err: any) {
        res.status(401).json({ error: err.message });
    };
}