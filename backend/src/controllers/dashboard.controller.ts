import { AuthRequest } from '../middleware/verifyToken';
import { Response } from 'express';
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

export const getMoodEntries = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	if (!userId) {
		throw new AppError('not authorized', 400);
	}
	const entries = await MoodEntry.find({ userId });
	res.status(200).json(entries);
};

export const updateMoodEntry = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	if (!userId) {
		throw new AppError('Not authorized', 401);
	}

	const { id } = req.params;
	const updatedData = req.body;

	const entry = await MoodEntry.findOneAndUpdate(
		{ _id: id, userId: userId }, // only update if entry belongs to this user
		updatedData,
		{ new: true, runValidators: true }
	);

	if (!entry) {
		throw new AppError('Mood entry not found or unauthorized', 404);
	}

	res.status(200).json(entry);
};


export const deleteMoodEntry = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	if (!userId) {
		throw new AppError('Not authorized', 401);
	}

	const { id } = req.params;

	const deletedEntry = await MoodEntry.findOneAndDelete({
		_id: id,
		userId: userId, // only delete if it belongs to the user
	});

	if (!deletedEntry) {
		throw new AppError('Mood entry not found or unauthorized', 404);
	}

	res.status(200).json({ message: 'Mood entry deleted', id });
};
