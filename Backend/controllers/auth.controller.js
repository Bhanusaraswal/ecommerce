import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { redis } from "../lib/redis.js"

//these are the function

const genrateToken=(userId)=>{
    const accessToken=jwt.sign({userId},process.env.ACCESSTOKEN_SECRET,{expiresIn:"15m" ,})

    //now refresh token
const refreshToken=jwt.sign({userId},process.env.REFRESHTOKEN_SECRET, {expiresIn:"7d"})
    return {accessToken,refreshToken};
}



const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};
//now make a function for set the cookie
const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

//signup

 const signup=async (req,res)=>{
    const {name , email, password}=req.body;
 

    try {
          const userExist=await User.findOne({email});
          if(userExist){
            return res.status(400).json({
                message:"user already exist"
            })
          }

//otherwise create the user in data base
const user= await User.create({name,email,password})

//now genrate the token
const { accessToken, refreshToken } = genrateToken(user._id);
//save the refreshtoken into the db
await storeRefreshToken(user._id, refreshToken);
//set the cookie
setCookies(res,accessToken,refreshToken);
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
        res.status(500).json({
            message:error.message
            
        })
    }
}

const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user= await User.findOne({email})
        console.log("login 1")

        if(user &&  (await user.comparePassword(password))){
            
           	const { accessToken, refreshToken } = genrateToken(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

            console.log("login2")
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
            
        }
        else {
			res.status(400).json({ message: "Invalid email or password" });
		}
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


const logout=async (req,res)=>{
    //here take the refeshtoken from the cookie
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const key = `refresh_token:${decoded.userId}`;
      await redis.del(key); // ⬅️ deletes the key
      console.log("Deleted redis key:", key);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const refreshToken=async (req,res)=>{
//now genrate the new access token from the refresh token
try {
    const refreshToken=req.cookies.refreshToken;

    if(!refreshToken){
        res.status(401).json({
            message:"NO refreshtoken provided"
        })
    }

    //now decode the refresh token
    const decode=jwt.verify(refreshToken,process.env.REFRESHTOKEN_SECRET);
    //now compare the store refreshtoken
    const store=redis.get(`refreshToken:${decode.userId}`);
    if(decode!=store){
        res.status(400).json({
            message:"invalid refrsh token"
        })
    }

    //otherwise genrate the new access token
    const accessToken=jwt.sign({userId:decode.userId},process.env.ACCESSTOKEN_SECRET,{expiresIn:"15m"})
    //now set this into the cookie

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});
res.status(200).json({
    message:"Token refreshed successfully"
})

} catch (error) {
    res.status(500).json({
        message:error.message
    })
}
}

// const getme=async (req,res)=>{
// try {
//     res.json(req.user)
// } catch (error) {
// res.status(500).json({ message: "Server error", error: error.message });

// }
// }

export {
    signup,
    login,
    logout,
    refreshToken
    // getme
}