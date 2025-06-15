import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		content: { type: String, required: true },
		isHidden: { type: Boolean, default: false },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
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
