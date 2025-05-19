import express from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { createMoodEntry, deleteMoodEntry, getMoodEntries, updateMoodEntry } from '../controllers/dashboard.controller';

const dashboardRouter = express.Router();

dashboardRouter.post('/new-entry', verifyToken, asyncHandler(createMoodEntry));
dashboardRouter.get('/get-all-entries', verifyToken, asyncHandler(getMoodEntries));
dashboardRouter.put('/update-entry/:id', verifyToken, asyncHandler(updateMoodEntry));
dashboardRouter.delete('/delete-entry/:id', verifyToken, asyncHandler(deleteMoodEntry));




export default dashboardRouter