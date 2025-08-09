import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD
  }
});

function createVerificationEmail(userEmail, token) {
    const verificationLink = `http://localhost:3000/api/guest/verify?token=${token}&email=${userEmail}`;
    return {
        from: 'smtp@mailtrap.io',
        to: userEmail,
        subject: 'Please verify your email',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Our App!</h2>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationLink}" 
            style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
            color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
            </a>
            <p>Or copy this link into your browser:</p>
            <p>${verificationLink}</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
        `,
        text: `Please verify your email by visiting this link: ${verificationLink}`
  };
}

export async function createUser(req,res){
    try{
        const {username,email,password} = req.body;
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing fields!" });
        }

        const user = new User({username,email,password});
        await user.save();
        
        console.log("user created", req.body);
        try{
            const user = await User.findOne({email});
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            const token = user.generateVerificationToken();
            await user.save();
            
            await transport.sendMail(createVerificationEmail(user.email, token));
            res.sendStatus(200); // Respond with 200 OK
            return true;
        }catch(error){
            console.error("Error generating verification token:", error);
            return res.status(500).json({message:"Internal server error"});
        }
    }catch(error){
        console.error("Error in createUser controller", error);
        res.status(500).json({message:"Internal server error"});

    }
}