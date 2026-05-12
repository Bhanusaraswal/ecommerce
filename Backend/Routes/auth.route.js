import express from "express";
import { signup, login, logout, refreshToken, getme, promoteToAdmin } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getme);


router.post("/promote-admin", promoteToAdmin);

export default router;
