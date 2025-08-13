import express from "express";
import {filePath, filePathStatic} from '../config/filePath.js';
import { verifyUser } from "../controllers/userSigninController.js";
import { forgotPassword } from "../controllers/userForgotPasswordController.js";
import { resetPassword } from "../controllers/userResetPasswordController.js";
import path from 'path';

const userSignInRouter = express.Router();

userSignInRouter.get("/", (req,res) => {
    res.sendFile(filePath('signIn.html')); 
});
userSignInRouter.post("/signin",verifyUser);
userSignInRouter.post("/forgot-password",forgotPassword);
userSignInRouter.get("/reset-password",resetPassword);
userSignInRouter.get("/reset-password-change", async (req, res) => {
    res.status(200).json({ message: "enter new password" });
});
console.log(path.join(filePathStatic, 'css/main.css')); // Verify the path

export default userSignInRouter;