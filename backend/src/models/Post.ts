import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		content: { type: String, required: true },
		image: { type: String },
		lucky: { type: Boolean, required: true }
	},
	{ timestamps: true }
);

export default mongoose.model('Post', PostSchema);
