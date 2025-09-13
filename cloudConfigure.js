import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

console.log("ENV TEST:", process.env.CLOUDINARY_CLOUD_NAME);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // match .env
  api_key: process.env.CLOUDINARY_API_KEY,        // match .env
  api_secret: process.env.CLOUDINARY_API_SECRET,  // match .env
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Wanderlust_Dev',
    format: async () => 'jpg',
    public_id: (req, file) => file.originalname,
  },
});

export { cloudinary, storage };
