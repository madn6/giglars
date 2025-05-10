import expres from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { createMoodEntry } from '../controllers/dashboard.controller';

const dashboardRouter = expres.Router();

dashboardRouter.post('/new-entry', verifyToken, asyncHandler(createMoodEntry));



export default dashboardRouter