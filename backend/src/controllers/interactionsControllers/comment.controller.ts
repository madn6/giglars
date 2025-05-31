import { Response } from 'express';
import Comment from '../../models/comment.model';
import Post from '../../models/Post.model';
import { AuthRequest } from '../../middleware/verifyToken';
import { AppError } from '../../utils/AppError';

// Create a comment
export const createComment = async (req: AuthRequest, res: Response) => {
	const { postId } = req.params;
	const { content } = req.body;
	const userId = req.userId;

	const newComment = await Comment.create({
		postId,
		userId,
		content
	});

	// Increment comment count on post
	await Post.findByIdAndUpdate(postId, {
		$inc: { 'stats.comments': 1 }
	});

	// Populate user for frontend rendering
	await newComment.populate('userId', 'displayName profileImage');

	res.status(201).json(newComment);
};

// Get comments for a post
export const getComments = async (req: AuthRequest, res: Response) => {
	const { postId } = req.params;

	const comments = await Comment.find({ postId })
		.sort({ createdAt: -1 })
		.populate('userId', 'displayName profileImage');

	res.status(200).json({ comments });
};

// Update a comment
export const updateComment = async (req: AuthRequest, res: Response) => {
	const { postId, commentId } = req.params;
	const { content } = req.body;
	const userId = req.userId;

	const comment = await Comment.findOneAndUpdate(
		{ _id: commentId, postId, userId },
		{ content },
		{ new: true }
	).populate('userId', 'displayName profileImage');

	if (!comment) {
		throw new AppError('Comment not found or unauthorized.', 404);
	}

	res.status(200).json(comment);
};

// Delete a comment
export const deleteComment = async (req: AuthRequest, res: Response) => {
	const { postId, commentId } = req.params;
	const userId = req.userId;

	const deleted = await Comment.findOneAndDelete({ _id: commentId, postId, userId });

	if (!deleted) {
		throw new AppError('Comment not found or unauthorized.', 404);
	}

	// Decrement comment count on post
	await Post.findByIdAndUpdate(postId, {
		$inc: { 'stats.comments': -1 }
	});

	res.status(200).json({ message: 'Comment deleted.', commentId });
};
