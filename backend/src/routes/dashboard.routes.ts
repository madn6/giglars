import express from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { createMoodEntry, getMoodEntries } from '../controllers/dashboard.controller';

const dashboardRouter = express.Router();

dashboardRouter.post('/new-entry', verifyToken, asyncHandler(createMoodEntry));
dashboardRouter.get('/get-all-entries', verifyToken, asyncHandler(getMoodEntries));



export default dashboardRouter