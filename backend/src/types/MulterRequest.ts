// src/types/MulterRequest.ts
import { Request } from 'express';

// Extending Multer's File type with Cloudinary-specific properties
interface CloudinaryFile extends Express.Multer.File {
  path: string; // Cloudinary URL for the uploaded file
}

// Extending the Express Request interface with the files array
export interface MulterRequest extends Request {
  files: CloudinaryFile[]; // Array of Cloudinary files
}
