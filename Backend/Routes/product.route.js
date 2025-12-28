import express from "express";
const productRouter =express.Router();
import { protectRoute ,adminRoute } from "../middleware/adminAuth.js";
import { createProduct, getAllProducts, getFeaturedProducts ,deleteProduct, getRecommendedProduct ,getProductsByCategory,toggleFeaturedProduct} from "../controllers/product.controller.js";
productRouter.get("/", protectRoute, adminRoute, getAllProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.post("/", protectRoute, adminRoute, createProduct);

productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/recommendation", getRecommendedProduct);
//here pass the id as parameter can be access by re.params.id
productRouter.delete("/:id", protectRoute, adminRoute, deleteProduct);
productRouter.post("/:id", protectRoute, adminRoute, toggleFeaturedProduct);


export{
    productRouter
}