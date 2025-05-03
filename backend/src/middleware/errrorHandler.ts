import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error('🔴', err.stack || err);

	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message
		});
	} else {
		res.status(500).json({
			success: false,
			message: 'Internal Server Error'
		});
	}
}	