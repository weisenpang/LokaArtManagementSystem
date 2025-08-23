import express from "express";
import {filePath, filePathStatic} from '../config/filePath.js';
import { verifyUser } from "../controllers/userSigninController.js";
import { forgotPassword } from "../controllers/userForgotPasswordController.js";
import { resetPassword, updatePassword } from "../controllers/userResetPasswordController.js";
import path from 'path';


const signInRouter = express.Router();

signInRouter.get("/signin", (req,res) => {
    res.sendFile(filePath('signIn.html')); 
});
signInRouter.post("/signin",verifyUser);
signInRouter.post("/forgot-password",forgotPassword);
signInRouter.get("/reset-password",resetPassword);
signInRouter.post("/reset-password", updatePassword);

console.log(path.join(filePathStatic, 'css/main.css')); // Verify the path




export default signInRouter;