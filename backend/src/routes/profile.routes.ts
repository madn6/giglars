import express from 'express';
import {
	deleteAccount,
	getProfileData,
	setupProfile,
	updateProfile,
	updateProfileImage
} from '../controllers/profile.controller';
import { verifyToken } from '../middleware/verifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { profileImageStorage } from '../utils/cloudinary';
import multer from 'multer';

const upload = multer({ storage: profileImageStorage });
const profileRouter = express.Router();

profileRouter.put('/profile-setup', verifyToken, asyncHandler(setupProfile));
profileRouter.patch('/profile-update', verifyToken, asyncHandler(updateProfile));
profileRouter.delete('/delete-account', verifyToken, asyncHandler(deleteAccount));
profileRouter.get('/get-profile-data', verifyToken, asyncHandler(getProfileData));
profileRouter.post(
	'/upload-profile-image',
	verifyToken,
	upload.single('profileImage'),
	asyncHandler(updateProfileImage)
);

export default profileRouter;
