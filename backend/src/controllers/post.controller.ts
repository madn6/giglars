import { RequestHandler } from 'express';
import { MulterRequest } from '../types/MulterRequest';
import Post from '../models/Post.model';

export const createPost: RequestHandler = async (req, res) => {
	try {
		const { content, feeling, isAnonymous, postDate, scheduledDate, tags, visibility, gifs } =
			req.body;

		const files = (req as MulterRequest).files;
		const imageUrls = files?.map((file) => (file as any).path) || [];

		const newPost = new Post({
			content,
			feeling,
			isAnonymous: isAnonymous === 'true',
			postDate,
			scheduledDate,
			images: imageUrls,
			tags: JSON.parse(tags) || [],
			visibility,
			gifs: JSON.parse(gifs || '[]')
		});

		await newPost.save();
		res.status(201).json({ message: 'Post created successfully', post: newPost });
	} catch (error) {
		console.error('Error creating post:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
