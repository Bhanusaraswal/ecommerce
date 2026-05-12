import crypto from "crypto";
import razorpay from "../lib/razorpay.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

/* ================================
   CREATE RAZORPAY ORDER
================================ */
export const createCheckoutSession = async (req, res) => {
	/* 
	// Removed 503 error to allow mock orders
	if (!razorpay) {
		return res.status(503).json({ 
			error: "Payment service unavailable. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables." 
		});
	}
	*/
	
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid products" });
		}

		let totalAmount = 0;

		products.forEach((product) => {
			totalAmount += product.price * product.quantity;
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
			});

			if (coupon) {
				totalAmount -= Math.round(
					(totalAmount * coupon.discountPercentage) / 100
				);
			}
		}

		// Ensure minimum amount (Razorpay requires at least 1 rupee = 100 paise)
		if (totalAmount < 1) {
			return res.status(400).json({ error: "Total amount must be at least ₹1" });
		}

		let razorpayOrder;
		if (razorpay) {
			razorpayOrder = await razorpay.orders.create({
				amount: Math.round(totalAmount * 100), // Convert to paise (Razorpay amount is in smallest currency unit)
				currency: "INR",
				receipt: `receipt_${Date.now()}`,
				notes: {
					userId: req.user._id.toString(),
					couponCode: couponCode || "",
					products: JSON.stringify(products.map(p => ({ id: p._id, quantity: p.quantity, price: p.price }))),
				},
			});
		} else {
			razorpayOrder = {
				id: `mock_order_${Date.now()}`,
				amount: Math.round(totalAmount * 100)
			};
		}

		res.status(200).json({
			orderId: razorpayOrder.id,
			amount: razorpayOrder.amount,
			key: process.env.RAZORPAY_KEY_ID || "mock_key",
		});
	} catch (error) {
		console.error("Error creating Razorpay order:", error.message);
		res.status(500).json({ 
			error: "Payment initialization failed",
			message: error.message 
		});
	}
};

// Helper function to create new coupon for user (if order >= $200)
async function createNewCoupon(userId) {
	try {
		await Coupon.findOneAndDelete({ userId });

		const newCoupon = new Coupon({
			code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
			discountPercentage: 10,
			expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
			userId: userId,
		});

		await newCoupon.save();
		return newCoupon;
	} catch (error) {
		console.log("Error creating new coupon:", error.message);
	}
}

/* ================================
   VERIFY PAYMENT & CREATE ORDER
================================ */
export const verifyPayment = async (req, res) => {
	/*
	if (!razorpay) {
		return res.status(503).json({ 
			error: "Payment service unavailable. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables." 
		});
	}
	*/
	
	try {
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			products,
			couponCode,
		} = req.body;

		const body = razorpay_order_id + "|" + razorpay_payment_id;

		if (razorpay) {
			const expectedSignature = crypto
				.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
				.update(body)
				.digest("hex");

			if (expectedSignature !== razorpay_signature) {
				return res.status(400).json({ error: "Payment verification failed" });
			}
		} else {
			if (razorpay_signature !== "mock_signature") {
				return res.status(400).json({ error: "Mock verification failed" });
			}
		}

		// Calculate total amount from products array
		let totalAmount = products.reduce(
			(sum, p) => sum + p.price * p.quantity,
			0
		);

		// Apply coupon discount if provided (before deactivating)
		if (couponCode) {
			const coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true, // Still active
			});
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
				// Now deactivate the coupon
				await Coupon.findOneAndUpdate(
					{ code: couponCode, userId: req.user._id },
					{ isActive: false }
				);
			}
		}

		// Check if order >= $200 to create new coupon
		if (totalAmount >= 200) {
			await createNewCoupon(req.user._id);
		}

		const order = new Order({
			user: req.user._id,
			products: products.map((p) => ({
				product: p._id,
				quantity: p.quantity,
				price: p.price,
			})),
			totalAmount,
			razorpayOrderId: razorpay_order_id,
			razorpayPaymentId: razorpay_payment_id,
			paymentStatus: "paid",
		});

		await order.save();

		res.status(200).json({
			success: true,
			message: "Payment verified & order created",
			orderId: order._id,
		});
	} catch (error) {
		console.error("Payment verification error:", error.message);
		res.status(500).json({ message: "Payment verification failed" });
	}
};
