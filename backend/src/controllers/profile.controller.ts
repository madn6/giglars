import { Response } from 'express';
import { AuthRequest } from '../middleware/verifyToken';
import User from '../models/Auth.model';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError';

export const setupProfile = async (req: AuthRequest, res: Response): Promise<void> => {
	const userId = req.userId;

	if (!userId) {
		res.status(400).json({ error: 'User not authenticated' });
		return;
	}

	const { bio, displayName, uniqueUsername, dob, gender, interests, location, website } = req.body;

	const updated = await User.findByIdAndUpdate(
		userId,
		{ bio, displayName, uniqueUsername, dob, gender, interests, location, website },
		{ new: true }
	);

	if (!updated) {
		res.status(404).json({ error: 'User not found' });
		return;
	}

	res.status(200).json({ message: 'Profile updated', user: updated });
};

export const getProfileData = async (req: AuthRequest, res: Response): Promise<void> => {
	const user = await User.findById(req.userId).select('-password -__v');
	if (!user) {
		throw new AppError('user not found', 404);
	}
	res.status(200).json({ message: 'user data', user });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
	const user = await User.findById(req.userId);

	if (!user) {
		throw new AppError('user not found', 404);
	}

	const { displayName, email, password } = req.body;
	if (displayName) user.displayName = displayName;
	if (email) user.email = email;
	if (password) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
	}

	await user.save();
	res.status(200).json({ message: 'Profile updated', user });
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
	await User.findByIdAndDelete(req.userId);
	res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'lax' });
	res.status(200).json({ message: 'Account deleted' });
};

export const updateProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
	if (!req.file) {
		res.status(400).json({ message: 'No file uploaded' });
		return;
	}

	const imageUrl = req.file.path // Multer + Cloudinary 
	const userId = req.userId;

	const user = await User.findByIdAndUpdate(
		userId,
		{ profileImage: imageUrl },
		{ new: true }
	).select('-password -__v');

	if (!user) {
		throw new AppError('user not found', 404);
	}

	res.status(200).json({ message: 'Profile image updated', user, imageUrl });
};
