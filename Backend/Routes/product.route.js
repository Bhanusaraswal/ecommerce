import express from "express";
import { protectRoute, adminRoute } from "../middleware/adminAuth.js";
import { 
    createProduct, 
    getAllProducts, 
    getFeaturedProducts, 
    deleteProduct, 
    getRecommendedProducts, // Fixed: Added 's' to match controller export
    getProductsByCategory, 
    toggleFeaturedProduct 
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.get("/", protectRoute, adminRoute, getAllProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.post("/", protectRoute, adminRoute, createProduct);

productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/recommendations", getRecommendedProducts); // Fixed: Added 's'

// Fixed: Changed from .post to .patch to match frontend axios.patch
productRouter.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
productRouter.delete("/:id", protectRoute, adminRoute, deleteProduct);

export { productRouter };