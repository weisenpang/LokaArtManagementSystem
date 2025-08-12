import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import signupRoutes from "./routes/signupRoutes.js"
import userSignInRouter from "./routes/userSigninRoutes.js";
import {filePathStatic} from './config/filePath.js';
import { uploadArtwork,getArtwork, findArtwork } from "./Utils/Gridfs.js";
import { updateHomepage } from "./controllers/homepageController.js";
// Load environment variables
dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT

const app = express()
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For form data
app.use("/", async (req, res,next) => {
  try {
      console.log("Homepage accessed");
      await updateHomepage(); // Update the homepage
  }catch (error) {
    console.error("Error in homepage middleware:", error);
    res.status(500).send("Internal Server Error");
  }
    next();
});
app.use(express.static(filePathStatic, {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
    }
    if (path.endsWith('.avif')) {
        res.setHeader('Content-Type', 'image/avif');
    }
    if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
    }
  }
}));



app.use("/guest", signupRoutes);// signup routes
app.use("/user", userSignInRouter);// signin routes



connectDB().then(()=>{
    app.listen(PORT, () => {
      
        console.log("server started on PORT:", PORT);
    });
});
