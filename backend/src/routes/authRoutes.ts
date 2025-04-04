import express from 'express';
import {
	registerUser,
	loginUser,
	checkAuth,
	logoutUser,
	refreshToken
} from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login',authRateLimiter, loginUser);
router.post('/refresh', refreshToken); // Refresh Access Token
router.get('/check-auth', verifyToken, checkAuth);
router.post('/logout', logoutUser); // Clear access & refresh cookies

export default router;
