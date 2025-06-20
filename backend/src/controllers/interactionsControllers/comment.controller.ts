import { Response } from 'express';
import Comment from '../../models/comment.model';
import Post from '../../models/Post.model';
import { AuthRequest } from '../../middleware/verifyToken';
import { AppError } from '../../utils/AppError';
import { Types } from 'mongoose';

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

	const comments = await Comment.find({ postId, isHidden: false })
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
	const { commentId, postId } = req.params;
	const userId = req.userId;

	const comment = await Comment.findById(commentId);
	if (!comment) {
		throw new AppError('Comment not found', 404);
	}

	// Only author or post owner can delete
	const post = await Post.findById(postId);
	//If the user is not the comment author AND is also not the post owner, then they are unauthorized to delete the comment.
	//Only the comment's author or the post owner is allowed to delete the comment.
	if (
		comment.userId.toString() !== userId &&
		(!post || !post.userId || post.userId.toString() !== userId)
	) {
		throw new AppError('unauthorized to delete.', 404);
	}

	await comment.deleteOne();

	res.status(200).json({ message: 'Comment deleted' });
};

//report comment

export const reportComment = async (req: AuthRequest, res: Response) => {
	const { commentId } = req.params;
	const { reason } = req.body;
	const userId = req.userId;

	if (!['spam', 'abuse', 'other'].includes(reason)) {
		throw new AppError('Invalid report reason', 400);
	}

	const comment = await Comment.findById(commentId);
	if (!comment) throw new AppError('Comment not found', 404);

	const alreadyReported = comment.reports.find((r) => r.reportedBy?.toString() === userId);
	if (alreadyReported) throw new AppError('Already reported.', 409);

	comment.reports.push({ reportedBy: userId, reason });
	comment.markModified('reports');

	const REPORT_THRESHOLD = 10;

	const totalReports = comment.reports.length;

	if (totalReports >= REPORT_THRESHOLD) {
		comment.isHidden = true;
		comment.markModified('isHidden');
		console.log('Marked as hidden');
	} else {
		console.log('❌ Not hidden. Total reports:', comment.reports.length);
	}

	await comment.save();

	res.status(200).json({ message: 'Comment reported successfully.' });
};

export const likeComment = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	const { commentId } = req.params;

	const comment = await Comment.findById(commentId);
	if (!comment) {
		throw new AppError('Comment not found', 404);
	}

	const userObjectId = new Types.ObjectId(userId);
	const liked = comment.likes.some((id) => id.equals(userObjectId));

	if (liked) {
		comment.likes = comment.likes.filter((id) => !id.equals(userObjectId));
	} else {
		comment.likes.push(userObjectId);
		comment.dislikes = comment.dislikes.filter((id) => !id.equals(userObjectId));
	}
	await comment.save();
	res.status(200).json({ message: liked ? 'unliked' : 'liked', likes: comment.likes.length });
};


export const disLikeComment = async (req: AuthRequest, res: Response) => {
	const userId = req.userId;
	const { commentId } = req.params;

	const comment = await Comment.findById(commentId);
	if (!comment) {
		throw new AppError('Comment not found', 404);
	}

	const userObjectId = new Types.ObjectId(userId);
	const disliked = comment.dislikes.some((id) => id.equals(userObjectId));

	if (disliked) {
		comment.dislikes = comment.dislikes.filter((id) => !id.equals(userObjectId));
	} else {
		comment.dislikes.push(userObjectId);
		comment.likes = comment.likes.filter((id) => !id.equals(userObjectId));
	}
	await comment.save();
	res.status(200).json({ message: disliked ? 'unliked' : 'liked', likes: comment.dislikes.length });
};
