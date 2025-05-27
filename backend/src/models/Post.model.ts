import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		content: String,
		feeling: String,
		gifs: { type: [String], default: [] },
		tags: { type: [String], default: [] },
		visibility: {
			type: String,
			enum: ['public', 'private', 'friends'],
			default: 'public'
		},
		images: { type: [String], default: [] },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

		// Interaction stats
		stats: {
			type: {
				luck: { type: Number, default: 0 },
				comments: { type: Number, default: 0 },
				caps: { type: Number, default: 0 },
				saves: { type: Number, default: 0 },
				shares: { type: Number, default: 0 }
			},
			required: true,
			default: () => ({
				luck: 0,
				comments: 0,
				caps: 0,
				saves: 0,
				shares: 0
			})
		},
		// Track users who interacted
		luckBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		saveBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		capBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		shareBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
	},
	{ timestamps: true }
);

export default mongoose.model('Post', postSchema);
