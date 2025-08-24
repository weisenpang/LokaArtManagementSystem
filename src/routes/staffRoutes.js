import express from "express";
import { filePath, filePathAdminDashboard, filePathStaticDashboard } from "../config/filePath.js";
import { User } from "../models/User.js";
import { UserTokenTerminate } from "../models/User.js";
const staffRouter = express.Router();

staffRouter.use("/:id", async (req, res, next) => {
    
    try {
        const user = await User.findOne({ _id: req.params.id, role: 'staff' , sessionToken: { $exists: true } });
        if (!user) {
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
      console.error("Error in admin route:", error);  
      res.status(500).send("Error loading staff dashboard, pookie! 😢")
    }
    next();
});


staffRouter.use(express.static(filePathStaticDashboard, {
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

staffRouter.use('/:id',express.static(filePathStaticDashboard, {
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



staffRouter.get("/:id", async (req, res) => {
  try{
    res.sendFile(filePathAdminDashboard('indexDashboard.html')); // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading staff dashboard, pookie! 😢");
    console.error("Error loading staff dashboard:", error);
  }
});

staffRouter.get("/:id/signout", async (req, res) => {
  try {
    UserTokenTerminate(req.params.id); // Terminate the session token
    res.redirect("/");
  }catch (error) {
    res.status(500).send("Error, pookie! 😢" + error);
  }
});

staffRouter.get("/:id/profile", async (req, res) => {
  try{
    res.sendFile(filePathAdminDashboard('Profile.html')); // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});

staffRouter.get("/:id/about", async (req, res) => {
  try{
    res.sendFile(filePathAdminDashboard('about.html')); 
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});

staffRouter.get("/:id/contact", async (req, res) => {
  try{
    res.sendFile(filePathAdminDashboard('contact.html')); // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});

export default staffRouter;