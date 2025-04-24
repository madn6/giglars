import express from 'express';
import { createPost } from '../controllers/post.controller';
import multer from 'multer';
import { storage } from '../utils/cloudinary';

const postRouter = express.Router();

const upload = multer({ storage });

postRouter.post('/create-post', upload.array('files'), createPost);

export default postRouter;
