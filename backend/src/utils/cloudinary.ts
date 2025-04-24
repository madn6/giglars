import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!
});

// Updated Cloudinary storage with upload_preset
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'giglars_post_image_uploads', // The folder where the images will be stored
		allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed image formats
		upload_preset: 'giglars_post_upload_preset' // Your upload preset (make sure it matches the preset you created in Cloudinary)
	} as {
		folder: string;
		allowed_formats: string[];
		upload_preset: string; // Include upload_preset in the params
	}
});

export { cloudinary, storage };
