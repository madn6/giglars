import express from 'express';
import {
	registerUser,
	loginUser,
	checkAuth,
	logoutUser,
	refreshToken,
	getUserInfo
} from '../controllers/auth.controller';
import { verifyToken } from '../middleware/verifyToken';
import { authRateLimiter } from '../middleware/rateLimiter';

const authRouter = express.Router();

// Auth routes
authRouter.post('/register', registerUser);
authRouter.post('/login', authRateLimiter, loginUser);
authRouter.post('/refresh', refreshToken); // Refresh Access Token
authRouter.get('/check-auth', verifyToken, checkAuth);
authRouter.post('/logout', logoutUser); // Clear access & refresh cookiesauthR
authRouter.get('/user-info', verifyToken,getUserInfo); // Clear access & refresh cookiesauthR


export default authRouter;
