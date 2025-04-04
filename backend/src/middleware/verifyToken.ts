// middleware/verifyToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
	userId?: string;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	const token = req.cookies?.token;
	if (!token) {
		res.status(401).json({ error: 'Not authenticated' });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
		req.userId = decoded.userId;
		next();
	} catch {
		res.status(403).json({ error: 'Invalid token' });
	}
};
