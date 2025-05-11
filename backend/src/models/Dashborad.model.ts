import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	type: { type: String, enum: ['lucky', 'unlucky', 'neutral'], required: true },
	description: {
		type: String,
		required: function (this: { type: string }) {
			return this.type === 'lucky' || this.type === 'unlucky';
		}
	},

	intensity: {
		type: Number,
		required: function (this: { type: string }) {
			return this.type === 'lucky' || this.type === 'unlucky';
		}
	},
	createdAt: { type: Date, default: Date.now }
});

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
