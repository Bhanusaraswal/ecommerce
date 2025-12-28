import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is require"]
    },
    email:{
        type:String,
        require:[true,"email is require"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        require:true,

    },
    cartItem: [
        {
            quantity:{
                type:Number,
                default:1
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product"
            }
        }
    ],
    role:{
        type: String,
        enum:["user","admin","customer"],
        default:"customer"
    }
       
    
})

//this is pre hook 
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});
userSchema.methods.comparePassword = async function (password) {
   
    return bcrypt.compare(password, this.password);
};


const User=mongoose.model("User",userSchema);
export default User