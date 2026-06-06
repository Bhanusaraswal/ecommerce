import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";


const generateToken = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESSTOKEN_SECRET,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESHTOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    if (!redis) {
        console.log("Redis not available for storing refresh token");
        return;
    }
    try {
        const expirationSeconds = 7 * 24 * 60 * 60; // 7 days
        await redis.set(`refresh_token:${userId}`, refreshToken, { ex: expirationSeconds });
    } catch (error) {
        console.log("Redis unavailable for storing refresh token:", error.message);
    }
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, 
		secure: true, // MUST be true for HTTPS cloud hosting
		sameSite: "none", // MUST be "none" to allow cross-domain cookie transfers
		maxAge: 15 * 60 * 1000, 
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, 
		secure: true, // MUST be true for HTTPS cloud hosting
		sameSite: "none", // MUST be "none" to allow cross-domain cookie transfers
		maxAge: 7 * 24 * 60 * 60 * 1000, 
	});
};

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
const signup = async (req, res) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        // BUG FIX: Was calling misspelled "genrateToken" — now "generateToken"
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            message: "User created successfully 🎉",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        // BUG FIX: Mongoose duplicate key error (code 11000) was surfacing as
        // a generic 500. Now returns a friendly 400 message.
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already in use" });
        }
        console.log("Error in signup:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
                if (redis) {
                    try {
                        await redis.del(`refresh_token:${decoded.userId}`);
                    } catch (redisError) {
                        console.log("Redis unavailable during logout, continuing");
                    }
                }
            } catch (error) {
                console.log("Error verifying token during logout:", error.message);
            }
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);

        if (redis) {
            try {
                const stored = await redis.get(`refresh_token:${decoded.userId}`);
                if (!stored || stored !== refreshToken) {
                    return res.status(401).json({ message: "Invalid refresh token" });
                }
            } catch (redisError) {
                console.log("Redis unavailable for refresh token validation:", redisError.message);
            }
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESSTOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({ message: "Token refreshed successfully" });
    } catch (error) {
        // BUG FIX: jwt.verify throws on invalid/expired token — catch properly
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }
        res.status(500).json({ message: error.message });
    }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
const getme = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── PROMOTE TO ADMIN (utility route) ────────────────────────────────────────
export const promoteToAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.role = "admin";
        await user.save();

        res.json({
            message: `User ${email} has been promoted to admin`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { signup, login, logout, refreshToken, getme };
