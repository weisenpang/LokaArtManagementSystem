import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import signupRoutes from "./routes/signupRoutes.js"

// Load environment variables
dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT

const app = express()
app.use(express.urlencoded({ extended: true })); // For form data
app.use("/api/guest", signupRoutes);// signup routes

app.use("/", async (req, res, next) => {
    res.redirect("/api/guest");
    next();
});
connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("server started on PORT:", PORT);
    });
});
