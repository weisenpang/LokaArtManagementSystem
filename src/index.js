import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import signupRoutes from "./routes/signupRoutes.js"
import signInRouter from "./routes/signinRoutes.js";
import {filePathStatic} from './config/filePath.js';
import { UserTokenTerminate } from "./models/User.js";
import staffRouter from "./routes/staffRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
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
app.use("/", signInRouter);// signin routes
app.use("/staff", staffRouter); // staff routes
app.use("/admin", adminRouter); // admin routes
app.use("/user", userRouter);// signin routes
app.post('/userSignOut.html/:id', async (req, res) => {
  
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

