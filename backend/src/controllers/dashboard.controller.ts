import { AuthRequest } from '../middleware/verifyToken';
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { MoodEntry } from '../models/Dashborad.model';

export const createMoodEntry = async (req: AuthRequest, res: Response): Promise<void> => {
	const { type, intensity, description } = req.body;

	if (!type) {
		throw new AppError('Type is required', 400);
	}

	if ((type === 'lucky' || type === 'unlucky') && (!description || !intensity)) {
		throw new AppError('Description and intensity are required for lucky/unlucky days', 400);
	}

	const userId = req.userId;

	if (!userId) {
		throw new AppError('not authorized', 400);
	}
	const newEntry = new MoodEntry({
		userId,
		type,
		intensity,
		description
	});

	await newEntry.save();

	res.status(201).json({ message: 'Mood entry saved', entry: newEntry });
};
