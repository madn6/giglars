import express from 'express';
import { setupProfile } from '../controllers/profile.controller';
import { verifyToken } from '../middleware/verifyToken'; // Assuming you want token verification for profile setup
import { asyncHandler } from '../utils/asyncHandler';

const profileRouter = express.Router();

profileRouter.put('/profile-setup', verifyToken, asyncHandler(setupProfile));

export default profileRouter;
