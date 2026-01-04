import express, { json } from "express"
import dotenv from "dotenv"
import router  from "./Routes/auth.route.js"
import { productRouter } from "./Routes/product.route.js";
import { cartRouter } from "./Routes/cart.route.js";
import couponrouter from "./Routes/coupon.route.js"
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app=express();
const PORT=process.env.PORT ||5000;
app.use(cookieParser()); 
app.use(express.json());
app.use("/api/auth",router);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/coupons",couponrouter );


app.listen(5000,()=>{
    console.log("app is listening " + PORT)
    //this is the function call
    connectdb();
})