import mongoose from "mongoose";

export const connectdb=async ()=>{
    try {
       const data= await mongoose.connect(process.env.MONGO_URL);
       console.log(`mongodb connected :${data.connection.host}`);
       
    } catch (error) {
        console.log("error");
        
    }
}

export default connectdb