import express from "express";
import { createUser } from "../controllers/signupController.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Gets the current file's absolute path
const __dirname = path.dirname(__filename); // Gets the directory name
const app = express()
app.use(express.static(path.join(__dirname, 'cozastore-master-template'))); 

const router = express.Router();
router.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,'../../cozastore-master-template', 'guest-signup.html')); 
});
router.post("/signup",createUser);

export default router;