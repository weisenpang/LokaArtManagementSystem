import express from "express";
import { createUser } from "../controllers/signupController.js";
import path from 'path';
import { fileURLToPath } from 'url';
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url); // Gets the current file's absolute path
const __dirname = path.dirname(__filename); // Gets the directory name
const app = express()
app.use(express.static(path.join(__dirname, 'cozastore-master-template'))); 

const router = express.Router();
router.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,'../../cozastore-master-template', 'guest-signup.html')); 
});

router.get('/verify', async (req, res) => {
  const { token, email } = req.query;
  
    try{
        const user = await User.findOne({ 
            email, 
            verificationToken: token, 
            verificationTokenExpires: { $gt: Date.now() } 
        });
        console.log("user found", user);
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token." });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
    }catch (error) {
        console.error("Error during verification:", error);
    }
    res.sendStatus(200); // Respond with 200 OK
});

router.post("/signup",createUser);

export default router;