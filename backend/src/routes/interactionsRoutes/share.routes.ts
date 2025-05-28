import express from 'express';
import { toggleLuckPost } from '../../controllers/interactionsControllers/luck.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { verifyToken } from '../../middleware/verifyToken';

const shareRouter = express.Router();

shareRouter.patch('/toggle-share-post/:id', verifyToken,);

export default shareRouter;
