import { Request, Response } from 'express';
import { MulterRequest } from '../types/MulterRequest';
import Post from '../models/Post.model';

export const createPost = async (req: Request, res: Response) => {
	const { content, feeling, isAnonymous, postDate, scheduledDate, tags, visibility, gifs } =
		req.body;

	const files = (req as MulterRequest).files;
	const imageUrls = files?.map((file) => (file as any).path) || [];

	const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags || '[]');
	const gifsArray = Array.isArray(gifs) ? gifs : JSON.parse(gifs || '[]');

	const newPost = new Post({
		content,
		feeling,
		isAnonymous: isAnonymous === 'true',
		postDate,
		scheduledDate,
		images: imageUrls,
		tags: tagsArray,
		visibility,
		gifs: gifsArray
	});

	await newPost.save();
	res.status(201).json({ message: 'Post created successfully', post: newPost });
};

export const getAllPosts = async (_req: Request, res: Response) => {
	const posts = await Post.find().sort({ createdAt: -1 }); 
	if (!posts || posts.length === 0) {
		res.status(404).json('no posts avilable');
	}

	res.status(200).json({
		success: true,
		posts: posts
	});
};
