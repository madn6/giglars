import { Request, Response, RequestHandler, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AuthenticatedRequest } from '../middleware/verifyToken';

interface RegisterUserBody {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const generateTokens = (userId: string) => {
	const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
		expiresIn: '15m'
	});

	const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
		expiresIn: '7d'
	});

	return { accessToken, refreshToken };
};

export const registerUser: RequestHandler<{}, {}, RegisterUserBody> = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { username, email, password, confirmPassword } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ error: 'Email already in use' });
			return;
		}

		if (password !== confirmPassword) {
			res.status(400).json({ error: 'Passwords do not match' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({ username, email, password: hashedPassword });

		const { accessToken, refreshToken } = generateTokens(newUser._id.toString());

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			maxAge: 15 * 60 * 1000
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		res.status(201).json({
			userId: newUser._id,
			profileImage: newUser.profileImage,
			email: newUser.email,
			name: newUser.username
		});
	} catch (error) {
		next(error);
	}
};

interface LoginUserBody {
	email: string;
	password: string;
}

export const loginUser: RequestHandler<{}, {}, LoginUserBody> = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).json({ message: 'User not found' });
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(400).json({ message: 'Invalid password' });
			return;
		}

		const { accessToken, refreshToken } = generateTokens(user._id.toString());

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			maxAge: 15 * 60 * 1000
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		res.status(200).json({
			userId: user._id,
			profileImage: user.profileImage,
			email: user.email,
			name: user.username
		});
	} catch (error) {
		next(error);
	}
};

export const checkAuth = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
		if (!req.userId) {
			res.status(401).json({ error: 'Unauthorized' });
			return;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		res.status(200).json({
			userId: user._id,
			profileImage: user.profileImage,
			name: user.username,
			email: user.email
		});
	} catch (err) {
		res.status(500).json({ error: 'Server error' });
	}
};

export const logoutUser: RequestHandler = (req, res) => {
	res.clearCookie('accessToken', {
		httpOnly: true,
		secure: true,
		sameSite: 'none'
	});

	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: true,
		sameSite: 'none'
	});

	res.status(200).json({ message: 'Logged out' });
};

export const refreshToken: RequestHandler = async (req, res): Promise<void> => {
	const token = req.cookies.refreshToken;
	if (!token) {
		res.status(401).json({ error: 'No refresh token' });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as {
			userId: string;
		};

		const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET as string, {
			expiresIn: '15m'
		});

		res.cookie('accessToken', newAccessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 15 * 60 * 1000
		});

		res.status(200).json({ message: 'Access token refreshed' });
	} catch (err) {
		res.status(403).json({ error: 'Invalid refresh token' });
	}
};

export const getUserInfo = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const userId = req.userId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		res.json({
			profileImage: user.profileImage,
			email: user.email,
			username: user.username
		});
	} catch (err) {
		next(err);
	}
};
