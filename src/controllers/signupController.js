import {User} from "../models/User.js";
import {transport, createVerificationEmail} from "../Utils/Email.js";

export async function createUser(req,res){
    try{
        const {lastname, firstname,email,password} = req.body;
        const username = `${firstname} ${lastname}`.trim();
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing fields!" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists!" });
        }
        const user = new User({username,email,password});
        await user.save();
        
        console.log("user created", req.body);
        try{
            const user = await User.findOne({email});
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            const token = user.generateVerificationToken();
            await user.save();
            
            await transport.sendMail(createVerificationEmail(user.email, token));
            res.status(200).json({ success: true, message: "Signup successful. Please verify your email." });
            return true;
        }catch(error){
            console.error("Error generating verification token:", error);
            return res.status(500).json({message:"Internal server error"});
        }
    }catch(error){
        console.error("Error in createUser controller", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}