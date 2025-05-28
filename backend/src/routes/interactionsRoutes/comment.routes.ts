import express from 'express';
import { toggleLuckPost } from '../../controllers/interactionsControllers/luck.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { verifyToken } from '../../middleware/verifyToken';

const commentRouter = express.Router();

commentRouter.patch('/toggle-comment-post/:id', verifyToken,);

export default commentRouter;
