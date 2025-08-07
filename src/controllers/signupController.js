import User from "../models/User.js";


export async function createUser(req,res){
    try{
        const {username,email,password} = req.body;
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing fields!" });
        }

        const user = new User({username,email,password});
        
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    }catch(error){
        console.error("Error in createUser controller", error);
        res.status(500).json({message:"Internal server error"});

    }
}