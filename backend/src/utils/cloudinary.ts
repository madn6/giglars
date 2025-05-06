// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!
});

// Storage for post images
const postImageStorage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => ({
		folder: 'giglars_post_image_uploads',
		allowed_formats: ['jpg', 'png', 'jpeg', 'gif',"webp"],
		upload_preset: 'giglars_post_upload_preset'
	})
});

// Storage for profile pictures
const profileImageStorage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => ({
		folder: 'giglars-user-profile',
		allowed_formats: ['jpg', 'jpeg', 'png',"webp"],
		upload_preset: 'giglars-profile-pictures'
	})
});

export { cloudinary, postImageStorage, profileImageStorage };
