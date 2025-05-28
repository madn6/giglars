import express from 'express';
import { toggleLuckPost } from '../../controllers/interactionsControllers/luck.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { verifyToken } from '../../middleware/verifyToken';

const capRouter = express.Router();

capRouter.patch('/toggle-cap-post/:id', verifyToken,);

export default capRouter;
