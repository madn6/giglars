
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
	userId?: string;
}


export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
	const token = req.cookies?.accessToken;

	if (!token) {
		res.status(401).json({ error: 'Not authenticated' });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
		req.userId = decoded.userId; // Directly attach userId to req
		next();
	} catch (err) {
		res.status(403).json({ error: 'Invalid token' });
	}
};
