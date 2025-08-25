import {User} from "../models/User.js";
import {transport, createVerificationEmail} from "../Utils/Email.js";

export async function createUser(req,res){
    try{
        const {lastname, firstname,email,password} = req.body;
        
        
        // Validate input
        if (!lastname|| !firstname || !email || !password) {
            return res.status(400).json({ error: "Missing fields!" });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists! Please try signing in instead." });
        }
        
        // Create user
        const user = new User({firstname,lastname,email,password});
        await user.save();
        
        console.log("User created:", email);
        
        // Send verification email
        try{
            const savedUser = await User.findOne({email});
            if (!savedUser) {
                return res.status(404).json({error: "User creation failed"});
            }

            const token = savedUser.generateVerificationToken();
            await savedUser.save();
            
            await transport.sendMail(createVerificationEmail(savedUser.email, token));
            
            // Send success response immediately
            return res.status(201).json({ 
                success: true, 
                message: "Account created successfully! Please check your email to verify your account." 
            });
            
        }catch(emailError){
            console.error("Error sending verification email:", emailError);
            // Even if email fails, don't fail the signup
            return res.status(201).json({ 
                success: true, 
                message: "Account created successfully! Please contact support if you don't receive a verification email." 
            });
        }
        
    }catch(error){
        console.error("Error in createUser controller:", error);
        return res.status(500).json({error: "Internal server error. Please try again later."});
    }
}