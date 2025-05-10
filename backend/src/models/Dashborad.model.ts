import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	type: { type: String, enum: ['lucky', 'unlucky', 'neural'], required: true },
	description: { type: String, required: true },
	intensity: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now }
});

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
