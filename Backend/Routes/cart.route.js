import { Router } from "express";
import { protectRoute } from "../middleware/adminAuth.js";
import { AddtoCart,deleteAll,updateQuantity , getAllProduct } from "../controllers/cart.controller.js";
import express from "express"
const cartRouter=express.Router()

cartRouter.post("/",protectRoute, AddtoCart);
cartRouter.delete("/",protectRoute, deleteAll);
cartRouter.get("/",protectRoute, getAllProduct);
cartRouter.put("/:id",protectRoute, updateQuantity);




export {
    cartRouter
}