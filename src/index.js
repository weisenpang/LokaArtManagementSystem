import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import signupRoutes from "./routes/signupRoutes.js"
import userSignInRouter from "./routes/userSigninRoutes.js";
import {filePathStatic} from './config/filePath.js';
import { updateHomepage } from "./controllers/homepageController.js";
import { uploadArtwork,retrieveImage, findArtwork } from "./Utils/Bson.js"; // Import the uploadArtwork function
import { User, UserTokenTerminate } from "./models/User.js";
// Load environment variables
dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT

const app = express()
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For form data
// app.get('/', async (req, res, next) => {
//     try {
//         console.log("Updating homepage... 💖");
//         await updateHomepage(); // Update the homepage
//         res.redirect('/homepage'); // Redirect to the homepage after updating
//     } catch (error) {
//       console.error("Error in homepage route:", error);
//     }
    
// });
app.use('/',express.static(filePathStatic, {
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

app.post('/userSignOut.html/:id', async (req, res) => {
  try {
    UserTokenTerminate(req.params.id); // Terminate the session token
    res.status(200).json({ message: "sign out successful" });
  }catch (error) {
    res.status(500).send("Error, pookie! 😢");
  }
});

app.post('/upload', async (req, res) => {
  try {
    //await uploadSingleDocument(req.body); // Reuse our safe function
    await uploadArtwork(); // Call the uploadArtwork function
    res.send("Success! 💖");
  } catch (error) {
    res.status(500).send("Error uploading, pookie! 😢");
  }
});

app.get('/retrieve', async (req, res) => {
  try {
    const data = await findArtwork(3); // Call the uploadArtwork function
    res.send(data);
  } catch (error) {
    res.status(500).send("Error uploading, pookie! 😢");
  }
});

connectDB().then(()=>{
    app.listen(PORT, () => {
      
        console.log("server started on PORT:", PORT);
    });
});

