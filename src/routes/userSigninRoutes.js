import express from "express";
import {filePath, filePathStatic} from '../config/filePath.js';
import { verifyUser } from "../controllers/userSigninController.js";
import { forgotPassword } from "../controllers/userForgotPasswordController.js";
import { resetPassword } from "../controllers/userResetPasswordController.js";
import path from 'path';
import { User } from "../models/User.js";

const userSignInRouter = express.Router();

userSignInRouter.get("/", (req,res) => {
    res.sendFile(filePath('signIn.html')); 
});
userSignInRouter.post("/signin",verifyUser);
userSignInRouter.post("/forgot-password",forgotPassword);
userSignInRouter.get("/reset-password",resetPassword);
userSignInRouter.post("/reset-password", async (req, res) => {
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
userSignInRouter.get("/staff", async (req, res) => {
    res.sendFile(filePath('home-03.html')); // Serve the staff dashboard
});
console.log(path.join(filePathStatic, 'css/main.css')); // Verify the path




export default userSignInRouter;