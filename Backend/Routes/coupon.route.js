import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const couponrouter = express.Router();

couponrouter.get("/", protectRoute, getCoupon);
couponrouter.post("/validate", protectRoute, validateCoupon);

export default couponrouter;