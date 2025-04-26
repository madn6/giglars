import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		content: { type: String },
		feeling: { type: String },
		gifs: { type: [String],default:[] },
		tags: { type: [String], default: [] },
		visibility: {
			type: String,
			enum: ['public', 'private', 'friends'],
			default: 'public'
		},
		images: { type: [String], default: [] } // ✅ Match controller
	},
	{ timestamps: true }
);

export default mongoose.model('Post', postSchema);
