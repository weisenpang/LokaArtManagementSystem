import { User } from "../models/User.js";
import { filePath } from '../config/filePath.js';
//import express from "express";
// const app = express()
// app.use(express.json()); // For parsing application/json
// app.use(express.urlencoded({ extended: true })); // For form data

export const resetPassword = async (req, res) => {
    try {
        
        res.sendFile(filePath('ResetPassword.html'));
        
    }catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updatePassword = async (req, res) => {
    const { password, email, token } = req.body;

    const user = await User.findOne({ 
        email,
        verificationToken: token, 
        verificationTokenExpires: { $gt: Date.now() } 

     });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }else {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        user.password = password; // Update the user's password
        await user.save(); // Save the updated user document
        
    }
    
    
}