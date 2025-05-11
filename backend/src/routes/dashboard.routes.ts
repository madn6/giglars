import express from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { createMoodEntry } from '../controllers/dashboard.controller';

const dashboardRouter = express.Router();

dashboardRouter.post('/new-entry', verifyToken, asyncHandler(createMoodEntry));



export default dashboardRouter