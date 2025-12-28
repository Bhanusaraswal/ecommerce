import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}
console.log("hello")
		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET);
            console.log(decoded)

			//We exclude the password to prevent sensitive data exposure.
			//  Even hashed passwords must never be sent or attached to request objects, logs, or responses. 
			// This follows the principle of least privilege and avoids accidental security leaks.
			
			const user = await User.findById(decoded.userId).select("-password");
            console.log(user)
			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}
			//assign user to req.user
			req.user = user;

			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};