import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary only if all required env vars are present
let cloudinaryConfigured = false;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	cloudinaryConfigured = true;
	console.log("✅ Cloudinary initialized successfully");
} else {
	console.log("⚠️  Cloudinary configuration incomplete. Image upload features will be disabled.");
}

// Export cloudinary object (it will be available but not configured)
export { cloudinary };
// Also export a flag to check if it's configured
export { cloudinaryConfigured };
export default cloudinary;