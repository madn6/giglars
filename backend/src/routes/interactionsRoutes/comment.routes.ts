import express from 'express';
import { toggleLuckPost } from '../../controllers/interactionsControllers/luck.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { verifyToken } from '../../middleware/verifyToken';
import { createComment, deleteComment, getComments, reportComment, updateComment } from '../../controllers/interactionsControllers/comment.controller';

const commentRouter = express.Router();

commentRouter.post('/post-comment/:postId', verifyToken, asyncHandler(createComment));
commentRouter.get('/get-comments/:postId', asyncHandler(getComments));
commentRouter.patch('/update-comment/:postId/:commentId', verifyToken, asyncHandler(updateComment));
commentRouter.delete('/delete-comment/:postId/:commentId', verifyToken, asyncHandler(deleteComment));
commentRouter.post('/report-comment/:commentId', asyncHandler(reportComment));
export default commentRouter;
