import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/verifyToken';
import { AppError } from '../../utils/AppError';
import Post from '../../models/Post.model';
import { Response } from 'express';

export const toggleLuckPost = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;

	if (!userId) {
		throw new AppError('User not authenticated', 401);
	}

	const postId = req.params.id;
	const post = await Post.findById(postId);

	if (!post) {
		throw new AppError('Post not found', 404);
	}

	const userObjectId = new mongoose.Types.ObjectId(userId);
	const hasLiked = post.luckBy.some((id) => id.equals(userObjectId));

	if (hasLiked) {
		// Unlike the post
		post.luckBy = post.luckBy.filter((id) => !id.equals(userObjectId));
	} else {
		// Like the post
		post.luckBy.push(userObjectId);
	}

	post.stats.luck = post.luckBy.length;
	await post.save();

	res.status(200).json({
		postId: post._id,
		luck: post.stats.luck,
		userHasLiked: !hasLiked 
	});
};
