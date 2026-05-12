import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
	const navigate = useNavigate();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const loadScript = (src) => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = src;
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};

	const handlePayment = async () => {
		try {
			// Load Razorpay script
			const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
			if (!isLoaded) {
				toast.error("Failed to load Razorpay. Please try again.");
				return;
			}

			// Create Razorpay order
			const res = await axios.post("/payment/create-order", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			const { orderId, amount, key } = res.data;

			if (key === "mock_key") {
				// Mock payment success
				await axios.post("/payment/verify-payment", {
					razorpay_order_id: orderId,
					razorpay_payment_id: "mock_payment_" + Date.now(),
					razorpay_signature: "mock_signature",
					products: cart,
					couponCode: coupon ? coupon.code : null,
				});
				toast.success("Payment successful (Mock)!");
				navigate("/purchase-success");
				return;
			}

			// Initialize Razorpay checkout
			const options = {
				key: key,
				amount: amount,
				currency: "INR",
				name: "Your Store",
				description: "Order Payment",
				order_id: orderId,
				handler: async function (response) {
					try {
						// Verify payment on backend
						await axios.post("/payment/verify-payment", {
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
							products: cart,
							couponCode: coupon ? coupon.code : null,
						});
						
						toast.success("Payment successful!");
						navigate("/purchase-success");
					} catch (error) {
						toast.error(error.response?.data?.error || "Payment verification failed");
					}
				},
				prefill: {
					name: "Customer",
					email: "customer@example.com",
				},
				theme: {
					color: "#10b981", // emerald color
				},
				modal: {
					ondismiss: function () {
						toast.error("Payment cancelled");
					},
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to initialize payment");
			console.error("Payment error:", error);
		}
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};
export default OrderSummary;