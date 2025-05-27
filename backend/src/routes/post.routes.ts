import express from 'express';
import { createPost, getAllPosts } from '../controllers/post.controller';
import multer from 'multer';
import { postImageStorage } from '../utils/cloudinary';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyToken } from '../middleware/verifyToken';

const postRouter = express.Router();

const upload = multer({ storage: postImageStorage });

postRouter.post('/create-post', upload.array('files'), verifyToken, asyncHandler(createPost));
postRouter.get('/get-all-posts', asyncHandler(getAllPosts));
postRouter.patch('/toggle-luck-post/:id', verifyToken, asyncHandler(toggleLuckPost));
postRouter.patch('/toggle-save-post/:id', verifyToken, asyncHandler(toggleSavePost));
postRouter.patch('/add-comment-post/:id', verifyToken, asyncHandler(addCommentToPost));
postRouter.patch('/share-post/:id', verifyToken, asyncHandler(incrementShareCount));
export default postRouter;



