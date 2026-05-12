import express from "express"
import { protectRoute } from "../middleware/adminAuth.js";
import { createCheckoutSession, verifyPayment } from "../controllers/payment.controller.js";

const paymentrouter=express.Router();
paymentrouter.post("/create-order", protectRoute, createCheckoutSession);
paymentrouter.post("/verify-payment", protectRoute, verifyPayment);

export default paymentrouter;