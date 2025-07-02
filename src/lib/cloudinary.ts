import { v2 as cloudinary } from 'cloudinary';

// Configure the Cloudinary SDK
// This uses the environment variables you set in .env.local
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Export the configured instance for use in other parts of your app
export default cloudinary;