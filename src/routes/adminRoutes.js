import express from "express";
import { filePath, filePathAdminDashboard, filePathStatic, filePathStaticDashboard } from "../config/filePath.js";
import { User } from "../models/User.js";
import { UserTokenTerminate } from "../models/User.js";
const adminRouter = express.Router();


adminRouter.get("/:id", async (req, res) => {
  try{
    const user = await User.findOne({ _id: req.params.id, role: 'admin' , sessionToken: { $exists: true } });
    try {
        if (!user || user.role !== 'admin') {
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
    res.render('indexDashboard.ejs',{
          firstname : user.firstname,
          lastname : user.lastname,
          role: user.role
    }) // Serve the staff dashboard
  }
  catch (error) {
    res.status(500).send("Error loading staff dashboard, pookie! 😢");
    console.error("Error loading staff dashboard:", error);
  }
});

adminRouter.get("/:id/signout", async (req, res) => {
  try {
    UserTokenTerminate(req.params.id); // Terminate the session token
    res.redirect("/");
  }catch (error) {
    res.status(500).send("Error, pookie! 😢" + error);
  }
});

adminRouter.get("/:id/profile", async (req, res) => {
  
  try{
    const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found! 😢");
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

adminRouter.get("/:id/about", async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found! 😢");
      }
      
      res.render('about.ejs', {
          id : user.id,
          role: user.role
      })
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});

adminRouter.get("/:id/contact", async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found! 😢");
      }
      
      res.render('contact.ejs', {
          id : user.id,
          role: user.role
      })
  }
  catch (error) {
    res.status(500).send("Error loading user profile, pookie! 😢");
    console.error("Error loading user profile:", error);
  }
});



adminRouter.use('/:id',express.static(filePathStaticDashboard, {
  
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
}, async (req, res, next) => {
  if (req.path.includes('/vendor/') || 
        req.path.includes('/css/') || 
        req.path.includes('/js/') ||
        req.path.includes('/img/') ||
        req.path.includes('/images/') || 
        req.path.includes('/png/') ||
        req.path.includes('/jpg/')) {
          
        return next();
    }
    try {
        const user = await User.findOne({ _id: req.params.id, role: 'admin' , sessionToken: { $exists: true } });
        if (!user || user.role !== 'admin') {
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
}));




adminRouter.use(express.static(filePathStaticDashboard, {
  
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

export default adminRouter;