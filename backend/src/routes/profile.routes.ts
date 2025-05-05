import express from 'express';
import { deleteAccount, getProfileData, setupProfile, updateProfile } from '../controllers/profile.controller';
import { verifyToken } from '../middleware/verifyToken'; // Assuming you want token verification for profile setup
import { asyncHandler } from '../utils/asyncHandler';

const profileRouter = express.Router();

profileRouter.put('/profile-setup', verifyToken, asyncHandler(setupProfile));
profileRouter.put('/profile-update', verifyToken, asyncHandler(updateProfile));
profileRouter.delete('/delete-account', verifyToken, asyncHandler(deleteAccount));
profileRouter.get('/get-profile-data', verifyToken, asyncHandler(getProfileData)); // Assuming you want to get profile data

export default profileRouter;
