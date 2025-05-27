import { Request, Response } from 'express';
import { MulterRequest } from '../types/MulterRequest';
import Post from '../models/Post.model';
import { AuthRequest } from '../middleware/verifyToken';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
	const { content, feeling, tags, visibility, gifs } = req.body;

	const files = (req as MulterRequest).files;
	const imageUrls = files?.map((file) => (file as any).path) || [];

	const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags || '[]');
	const gifsArray = Array.isArray(gifs) ? gifs : JSON.parse(gifs || '[]');

	const userId = req.userId;

	if (!userId) {
		throw new AppError('User not authenticated', 401);
	}

	const newPost = new Post({
		content,
		feeling,
		images: imageUrls,
		tags: tagsArray,
		visibility,
		gifs: gifsArray,
		userId
	});

	await newPost.save();
	res.status(201).json({ message: 'Post created successfully', post: newPost });
};

export const getAllPosts = async (req: Request, res: Response) => {
	const { feeling } = req.query; // Get the "feeling" query parameter

	let filter = {}; // Start with an empty filter
	if (feeling && feeling !== 'all') {
		filter = { feeling }; // If feeling is provided, filter posts by feeling
	}

	// Fetch posts with the feeling filter (if provided)
	const posts = await Post.find(filter)
		.populate('userId', 'displayName profileImage uniqueUsername')
		.sort({ createdAt: -1 }); // Sort posts by creation date

	if (!posts || posts.length === 0) {
		throw new AppError('No posts found', 404);
	}

	res.status(200).json({
		success: true,
		posts
	});
};

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

  res.status(200).json({ postId: post._id, luck: post.stats.luck });
};
