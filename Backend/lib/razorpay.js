import Razorpay from "razorpay";

let razorpay = null;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keySecret) {
	razorpay = new Razorpay({
		key_id: keyId,
		key_secret: keySecret,
	});
	console.log("✅ Razorpay initialized successfully");
} else {
	console.warn(
		"⚠️ Razorpay not initialized. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET"
	);
}

export default razorpay;
