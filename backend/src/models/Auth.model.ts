import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profileImage: {
			type: String,
			default: '../images/dummyUser.jpg'
		},
		// Additional profile fields
		displayName: { type: String, default: '' },
		uniqueUsername: {
			type: String,
			match: /^@[a-zA-Z0-9_]{3,20}$/,
			trim: true
		},
		bio: { type: String, default: '' },
		dob: { type: Date },
		gender: { type: String, enum: ['male', 'female', 'other'] },
		interests: [{ type: String }],
		location: { type: String },
		website: { type: String }
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
