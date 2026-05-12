import Product from "../models/product.model.js";



export const AddtoCart = async (req, res) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}


		const productExists = await Product.findById(productId);
		if (!productExists) {
			return res.status(404).json({ message: "Product not found" });
		}

		const user = req.user;
		const existingItem = user.cartItems.find(
			(item) => item.product && item.product.toString() === productId.toString()
		);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId, quantity: 1 });
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in AddtoCart:", error.message);
		res.status(500).json({ message: "Error adding to cart", error: error.message });
	}
};

export const deleteAll = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			// No productId means clear the entire cart
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter(
				(item) => item.product && item.product.toString() !== productId.toString()
			);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in deleteAll:", error.message);
		// BUG FIX: Was sending res.json (200) on errors — now sends proper 500
		res.status(500).json({ message: "Error removing items from cart", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
	
		const { quantity } = req.body;
		const productId = req.params.id;
		const user = req.user;

		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		
		if (quantity === undefined || quantity === null || isNaN(quantity) || quantity < 0) {
			return res.status(400).json({ message: "Valid quantity is required" });
		}

		const existItem = user.cartItems.find(
			(item) => item.product && item.product.toString() === productId.toString()
		);

		if (existItem) {
			if (Number(quantity) === 0) {
				user.cartItems = user.cartItems.filter(
					(item) => item.product && item.product.toString() !== productId.toString()
				);
				await user.save();
				return res.json(user.cartItems);
			}

			existItem.quantity = Number(quantity);
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (error) {
		console.log("Error in updateQuantity:", error.message);
		res.status(500).json({ message: error.message || "Error updating quantity" });
	}
};

export const getCartProducts = async (req, res) => {
	try {
		const productIds = req.user.cartItems.map((item) => item.product).filter(Boolean);

		if (productIds.length === 0) {
			return res.json([]);
		}

		const products = await Product.find({ _id: { $in: productIds } });

		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find(
				(cartItem) =>
					cartItem.product && cartItem.product.toString() === product._id.toString()
			);
			return { ...product.toJSON(), quantity: item ? item.quantity : 1 };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
