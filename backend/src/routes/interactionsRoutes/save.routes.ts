import express from 'express';
import { toggleLuckPost } from '../../controllers/interactionsControllers/luck.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { verifyToken } from '../../middleware/verifyToken';

const saveRouter = express.Router();

saveRouter.patch('/toggle-save-post/:id', verifyToken,);

export default saveRouter;
