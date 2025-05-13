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

export const getMoodEntries = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	if (!userId) {
		throw new AppError('not authorized', 400);
	}
	const entries = await MoodEntry.find({ userId });
	res.status(200).json(entries);
};

export const updateMoodEntry = async (req: Request, res: Response) => {
	const { id } = req.params;
	const updatedData = req.body();

	const updatedEntry = await MoodEntry.findByIdAndUpdate(id, updatedData, {
		new: true,
		runValidators: true
	});

	if (!updatedEntry) {
		throw new AppError('Mood entry not found', 404);
	}

	res.status(200).json(updatedEntry);
};

export const deleteMoodEntry = async(req: Request, res: Response) => {

	const { id } = req.params;

	const deletedEntry = await MoodEntry.findByIdAndDelete(id);
	if (!deletedEntry) {
		throw new AppError('Mood entry not found', 404);

	}

	res.status(200).json({message:"mood entry deleted",id})
};
