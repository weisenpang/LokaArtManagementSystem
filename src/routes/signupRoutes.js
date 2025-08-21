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

signupRouter.get('/verify', userVerify);

signupRouter.post("/signup",createUser);

export default signupRouter;