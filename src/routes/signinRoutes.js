import express from "express";
import {filePath, filePathStatic} from '../config/filePath.js';
import { verifyUser } from "../controllers/userSigninController.js";
import { forgotPassword } from "../controllers/userForgotPasswordController.js";
import { resetPassword } from "../controllers/userResetPasswordController.js";
import path from 'path';
import { User } from "../models/User.js";

const signInRouter = express.Router();

signInRouter.get("/signin", (req,res) => {
    res.sendFile(filePath('signIn.html')); 
});
signInRouter.post("/signin",verifyUser);
signInRouter.post("/forgot-password",forgotPassword);
signInRouter.get("/reset-password",resetPassword);
signInRouter.post("/reset-password", async (req, res) => {
    const { password, confirmPassword } = req.body;

    const email = req.body.email; // Assuming email is sent in the request body
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }else {
        user.password = password; // Update the user's password
        await user.save(); // Save the updated user document
        return res.status(400).json({ message: "Passwords match." });
    }
});

console.log(path.join(filePathStatic, 'css/main.css')); // Verify the path




export default signInRouter;