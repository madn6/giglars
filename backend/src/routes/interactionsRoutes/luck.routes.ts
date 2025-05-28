import express from 'express';
import { toggleLuckPost } from '../../controllers/interactionsControllers/luck.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { verifyToken } from '../../middleware/verifyToken';

const luckRouter = express.Router();

luckRouter.patch('/toggle-luck-post/:id', verifyToken, asyncHandler(toggleLuckPost));

export default luckRouter;
