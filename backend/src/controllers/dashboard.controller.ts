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
	const entries = await MoodEntry.find({ userId }).sort({ createdAt: -1 });
	res.status(200).json(entries);
};

export const updateMoodEntry = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	if (!userId) {
		throw new AppError('Not authorized', 401);
	}

	const { id } = req.params;
	const updatedData = req.body;

	const entry = await MoodEntry.findOne({ _id: id, userId: userId });
	if (!entry) {
		throw new AppError('Mood entry not found or unauthorized', 404);
	}

	//Same-day restriction
	const createdDate = new Date(entry.createdAt).toDateString();
	const today = new Date().toDateString();
	if (createdDate !== today) {
		throw new AppError('You can only update entries on the same day they were created', 403);
	}

	const updatedEntry = await MoodEntry.findByIdAndUpdate(id, updatedData, {
		new: true,
		runValidators: true
	});

	res.status(200).json(updatedEntry);
};

export const deleteMoodEntry = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	if (!userId) {
		throw new AppError('Not authorized', 401);
	}

	const { id } = req.params;

	const entry = await MoodEntry.findOne({ _id: id, userId: userId });
	if (!entry) {
		throw new AppError('Mood entry not found or unauthorized', 404);
	}

	//Same-day restriction
	const createdDate = new Date(entry.createdAt).toDateString();
	const today = new Date().toDateString();
	if (createdDate !== today) {
		throw new AppError('You can only delete entries on the same day they were created', 403);
	}

	await MoodEntry.findByIdAndDelete(id);

	res.status(200).json({ message: 'Mood entry deleted', id });
};
