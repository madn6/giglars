import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		content: { type: String, required: true },
		isHidden: { type: Boolean, default: false },
		reports: [
			{
				reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				reason: { type: String, enum: ['spam', 'abuse', 'other'], required: true },
				createdAt: { type: Date, default: Date.now }
			}
		]
	},
	{ timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
