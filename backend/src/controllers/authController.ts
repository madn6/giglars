import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface RegisterUserBody {
	username: string;
	email: string;
	password: string;
}

export const registerUser: RequestHandler<{}, {}, RegisterUserBody> = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { username, email, password } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({ username, email, password: hashedPassword });
		await newUser.save();

		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		next(error);
	}
};

interface LoginUserBody {
	email: string;
	password: string;
}

export const loginUser: RequestHandler<{},{},LoginUserBody> = async (
	req: Request,
	res: Response,
	next: NextFunction
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

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
			expiresIn: '1d'
		});

		res.status(200).json({ token, userId: user._id });
	} catch (error) {
		next(error);
	}
};
