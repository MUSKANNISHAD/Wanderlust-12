import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config(); // Make sure this is at the top

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust_Dev',
    format: async (req, file) => 'jpg', // default to jpg
    public_id: (req, file) => file.originalname, // optional: custom file name
  },
});

export { cloudinary, storage };
