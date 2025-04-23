import Post from '../models/Post.model';

export const createPost = async (req, res) => {
	const {
		content,
		feeling,
		isAnonymous,
		postDate,
		scheduledDate,
		postGif,
		tags,
		visibility,
		files
	} = req.body;

	try {
		const newPost = new Post({
			content,
			feeling,
			isAnonymous,
			postDate,
			scheduledDate,
			postGif,
			tags,
			visibility,
			files
		});

		await newPost.save();
		res.status(201).json({ message: 'post created successfully', post: newPost });
	} catch (error) {
		console.error('error creating post ', error);
		res.status(500).json({ messge: 'internal server error' });
	}
};
