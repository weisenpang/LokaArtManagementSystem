import express from "express";
import {filePath, filePathStatic} from '../config/filePath.js';
import { verifyUser } from "../controllers/userSigninController.js ";
import path from 'path';

const app = express()
const userSignInRouter = express.Router();

userSignInRouter.get("/", (req,res) => {
    res.sendFile(filePath('signIn.html')); 
});
userSignInRouter.post("/signin",verifyUser);

console.log(path.join(filePathStatic, 'css/main.css')); // Verify the path

export default userSignInRouter;