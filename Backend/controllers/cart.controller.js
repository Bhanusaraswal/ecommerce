import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const AddtoCart = async (req, res) => {
  //take the product id from the req.body
  try {
    const {productId }= req.body;
    //also take the user from the middleware
    const user = req.user;
    //agr item pehle se hee hai to just increase the quantity
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      //just increase the val
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
	console.log("error in the add to cart",error.message)
	res.status(500).json({
		message:"error in the add to cart" 
	})
  }
};


//another is deleteall items of same product
export const deleteAll=async(req,res)=>{
	try {
		const {productId}=req.body;
		const user=req.user;
		if(!productId){
			//no product id is pass
			//give the empty
			user.cartItems=[]
		}
		else{
			//filter kya krta hai ki pure cartitem wale pr traverse krega mtlb saare item pr jayega
			//after this filter make a array tht satisfy the inner condition
			//here the condition is is the item id !== product id
			user.cartItems=user.cartItems.filter((item)=>
				item.id!==productId
			)
		}
		user.save();
		res.json(user.cartItems)

	} catch (error) {
		console.log("error in the delete the item")
		res.json({
			message:"error in the removung the items and deleting"
		})
	}
}


//update the quantity
export const updateQuantity=async(req,res)=>{
	try {
		//take the quantiy fron the frontend
		const quantity=req.body;
		const {productId}=req.params;
		const user=req.user;
		//chk if the product already in the cart
		const existItem=user.cartItems.find((items)=> items.id===productId);
		if(existItem){
			//agr existing product ki quantiy zero hai
			if(quantity===0){
				//mtlb jo maine diya hai uski quantity zero then remove tht product and update the user
				//remove the items tht have the product id
				user.cartItems=user.cartItems.filter((items)=> items.id!==productId);
				await user.save();
				return res.json(user.cartItems)
			}
			//aga zero nahi hai toh update the quantity
			existItem.quantity==quantity
			await user.save();
			res.json(user.cartItems);
		}
		else{
			res.status(401).json({
				message:"no product found"
			})
		}
	} catch (error) {
		res.status(500).json({
			message:error.message
		})
	}
}


//get all product
export const getCartProducts = async (req, res) => {
	try {
		//this gives an array of diffrent produxt
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// add quantity for each product
		//map create a new array where it store the return thingd without modify the origina array
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};