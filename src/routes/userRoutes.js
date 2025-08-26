import express from "express";
import { filePath, filePathStatic } from "../config/filePath.js";
import { User } from "../models/User.js";
import { UserTokenTerminate } from "../models/User.js";
const userRouter = express.Router();





userRouter.get("/:id", async (req, res) => {
  try{
    try {
        const user = await User.findOne({ _id: req.params.id, role: 'user' , sessionToken: { $exists: true } });
        if (!user || user.role !== 'user') {
            res.status(404).send("Unauthorized User! 😢");
            return;
        }
        if (!user.sessionToken) {
            res.status(404).send("User session unverified! 😢");
            return;
        }
        console.log("User found:", user);
    }
    catch (error) {
      console.error("Error in user route:", error);  
      res.status(500).send("Error loading staff dashboard, pookie! 😢")
    }
    res.sendFile(filePath('home-03.html')); // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading staff dashboard, pookie! 😢");
    console.error("Error loading staff dashboard:", error);
  }
});


userRouter.get("/:id/signout", async (req, res) => {
  try {
    UserTokenTerminate(req.params.id); // Terminate the session token
    res.redirect("/");
  }catch (error) {
    res.status(500).send("Error, pookie! 😢" + error);
  }
});

userRouter.get("/:id/profile", async (req, res) => {
  
  try{
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.render('Error.ejs', { message: "User not found! 😢" });
    }
    const date = new Date(user.createdAt);
    const formattedDate = date.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
    res.render('Profile.ejs', {
          firstname : user.firstname,
          lastname : user.lastname,
          email : user.email,
          date : formattedDate,
          artworks : user.artworks || [],
          role: user.role === 'user' ? true : false
          
      }) // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});

userRouter.get("/:id/about", async (req, res) => {
  try{
    res.sendFile(filePath('about.html')); // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});

userRouter.get("/:id/contact", async (req, res) => {
  try{
    res.sendFile(filePath('contact.html')); // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});


userRouter.use('/:id',express.static(filePathStatic, {
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



userRouter.use('/',express.static(filePathStatic, {
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



export default userRouter;