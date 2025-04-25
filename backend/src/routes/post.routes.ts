import express from 'express';
import { createPost } from '../controllers/post.controller';
import multer from 'multer';
import { storage } from '../utils/cloudinary';
import { asyncHandler } from '../utils/asyncHandler';

const postRouter = express.Router();

const upload = multer({ storage });

postRouter.post('/create-post', upload.array('files'), asyncHandler(createPost));

export default postRouter;



