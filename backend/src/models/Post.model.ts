import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		content: { type: String, },
		feeling: { type: String, },
		isAnonymous: { type: Boolean, },
		postDate: { type: Date, default: Date.now },
		scheduledDate: { type: Date, },
		postGif: { type: String,  }, // Store URL or name if you need to save it
		tags: { type: [String], default: [] },
		visibility: { type: String, enum: ['public', 'private', 'friends'],},
		files: { type: [String], default: [] } // Store image URLs or file paths if needed
	},
	{ timestamps: true }
);

export default mongoose.model('Post', postSchema);
