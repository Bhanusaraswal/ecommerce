import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import { cloudinary, cloudinaryConfigured } from "../lib/cloudinary.js";
import mongoose from "mongoose";
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts;
		// Try to get from Redis cache
		if (redis) {
			try {
				 featuredProducts = await redis.get("featured_products");
				if (featuredProducts) {
					//parse kisliye kyoki redis me data sting format mein hota hao to ise phir se object format mein convert krte hai
					return res.json(JSON.parse(featuredProducts));
				}
			} catch (redisError) {
				// Redis not available, continue to fetch from database
				console.log("Redis unavailable, fetching from database");
			}
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access (only if Redis is available)
		//because redis store data in string format then we convert the object into string before saving into the redis
		if (redis) {
			try {
				await redis.set("featured_products", JSON.stringify(featuredProducts));
			} catch (redisError) {
				// Redis not available, but continue anyway
				console.log("Redis unavailable for caching, but continuing");
			}
		}

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        // Validation: Ensure image exists before uploading
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        let cloudinaryResponse = null;

        try {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        } catch (uploadError) {
            console.log("Cloudinary upload error", uploadError);
            return res.status(400).json({ message: "Image upload failed" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });

        res.status(201).json(product);

    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const deleteProduct=async (req,res)=>{
try {
		const product=await Product.findById(req.params.id)
		if(!product){
			return res.status(401).json({message:"product not found"})
		}

		//otherwise product exist then delete the image  from the cloudinary
		if(product.image && cloudinaryConfigured){
			const publicId=product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`)
				console.log("deleted image from the cloudinary")
			} catch (error) {
				console.log("error deleting image from the cloudinary",error.message)
			}
		}
		//now delete from the Product database
		await Product.findByIdAndDelete(req.params.id)
		res.json({message:"Product deleted successfully"})

	} catch (error) {
		console.log("error in deletin the product",error)
		res.status(501).json({message:"server error",error :error.message})
	}
}

//give suggestion tht the user also intrest in these products
export const getRecommendedProducts = async (req, res) => {
try {
	const products=await Product.aggregate([
		{
			$sample:{size :4},
		},
		{
			$project:{
				_id: 1,
				 name: 1,
				  description: 1,
				   image: 1, 
				   price: 1,
			}
		}
])
res.json(products)

} catch (error) {
	res.status(500).json({
		message:"error in the recommendation "
	})
}
};



export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

//toggle the featured produt to unfeatured product
export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			//yeh refresh kr rhe hai featured product list ko in the redis data base
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		if (redis) {
			try {
				await redis.set("featured_products", JSON.stringify(featuredProducts));
			} catch (redisError) {
				// Redis not available, skip caching
				console.log("Redis unavailable, skipping cache update");
			}
		}
	} catch (error) {
		console.log("error in update cache function", error.message);
	}
}