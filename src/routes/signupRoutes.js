import express from "express";
import { createUser } from "../controllers/signupController.js";
import {filePath, filePathStatic} from '../config/filePath.js';
import {userVerify} from "../models/User.js";


const app = express()
app.use(express.static(filePathStatic)); 

const router = express.Router();
router.get("/", (req,res) => {
    res.sendFile(filePath('guest-signup.html')); 
});

router.get('/verify', async (req, res) => {
    const { token, email } = req.query;
    userVerify(email, token, res);
});

router.post("/signup",createUser);

export default router;