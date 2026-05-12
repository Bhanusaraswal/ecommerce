import mongoose from "mongoose";

export const connectdb=async ()=>{
    try {
		if (!process.env.MONGO_URL) {
			console.log("⚠️  MONGO_URL not found in environment variables");
			return;
		}
       const data= await mongoose.connect(process.env.MONGO_URL);
       console.log(`✅ mongodb connected :${data.connection.host}`);
       
    } catch (error) {
        console.log("❌ MongoDB connection error:", error.message);
        
    }
}

export default connectdb