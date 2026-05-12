import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import router  from "./Routes/auth.route.js"
import { productRouter } from "./Routes/product.route.js";
import { cartRouter } from "./Routes/cart.route.js";
import couponrouter from "./Routes/coupon.route.js"
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import paymentrouter from "./Routes/payment.route.js";
import analyticsrouter from "./Routes/analytics.route.js";
dotenv.config();

const app=express();
const PORT=process.env.PORT ||5000;

// Configure CORS with credentials support
app.use(cors({
	origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite default port
	credentials: true, // Allow cookies to be sent
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser()); 
app.use(express.json());
app.use("/api/auth",router);
app.use("/api/products",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/coupons",couponrouter );
app.use("/api/payment",paymentrouter);
app.use("/api/analytics",analyticsrouter);


app.listen(PORT,()=>{
    console.log("app is listening on port " + PORT)
    //this is the function call
    connectdb();
})