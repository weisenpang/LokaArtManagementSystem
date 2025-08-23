import express from "express";
import { createUser } from "../controllers/signupController.js";
import {filePath, filePathStatic} from '../config/filePath.js';
import {userVerify} from "../models/User.js";


const app = express()
app.use(express.static(filePathStatic)); 

const signupRouter = express.Router();
signupRouter.get("/", (req,res) => {
    res.sendFile(filePath('guest-signup.html')); 
});

signupRouter.get('/verify', async (req, res) => {
    try {
        const {token, email} = req.query;
        
        const isVerified = await userVerify(email, token); // Call verifyUser to handle the request
        console.log("isVerified from query:", isVerified);
        if (!isVerified) {
            
            return res.status(400).json({ message: "Invalid or expired verification token." }); // Respond with an error if verification fails
        }
        res.status(200).send("Email successfully verified. You can now sign in.");
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).send("Internal server error");
    }
});

signupRouter.post("/signup",createUser);

export default signupRouter;