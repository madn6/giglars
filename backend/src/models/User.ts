import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profileImage: {
			type: String,
			default:'../images/dummyUser.jpg'
			
		}
	},
	{ timestamps: true }
);

export default mongoose.model('User', UserSchema);
