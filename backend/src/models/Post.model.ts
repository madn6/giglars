import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
	{
		
	},
	{ timestamps: true }
);

export default mongoose.model('Post', PostSchema);
