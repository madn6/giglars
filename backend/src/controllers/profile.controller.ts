import { Response } from 'express';
import { AuthRequest } from '../middleware/verifyToken'; 
import User from '../models/Auth.model';

export const setupProfile = async (req: AuthRequest, res: Response): Promise<void> => {
	const userId = req.userId;

	if (!userId) {
		res.status(400).json({ error: 'User not authenticated' });
		return;
	}

	const { bio, displayName, uniqueUsername, dob, gender, interests, location, website } = req.body;

		const updated = await User.findByIdAndUpdate(
			userId,
			{ bio, displayName,uniqueUsername, dob, gender, interests, location, website },
			{ new: true }
		);

		if (!updated) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		res.status(200).json({ message: 'Profile updated', user: updated });

};
