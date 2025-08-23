import { userVerify } from "../models/User.js";
import { filePath } from '../config/filePath.js';
//import express from "express";
// const app = express()
// app.use(express.json()); // For parsing application/json
// app.use(express.urlencoded({ extended: true })); // For form data

export const resetPassword = async (req, res) => {
    try {
        const {token, email} = req.query;
        
        const isVerified = await userVerify(email, token); // Call verifyUser to handle the request
        console.log("isVerified from query:", isVerified);
        if (!isVerified) {
            
            return res.status(400).json({ message: "Invalid or expired verification token." }); // Respond with an error if verification fails
        }

        console.log("isVerified:", isVerified); 
        res.sendFile(filePath('reset-password.html'));
        
    }catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}