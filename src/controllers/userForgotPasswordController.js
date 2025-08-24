import { User } from "../models/User.js";
import { createForgotPasswordEmail } from "../Utils/Email.js";
import { transport } from "../Utils/Email.js";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: "Please provide an email address" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "No account found with this email address",
                redirectTo: "guest-signup.html"
            });
        }
        
        // Generate a password reset token
        const token = user.generateVerificationToken();
        console.log("Generated token:", token);
        await user.save();
        
        try {
            await transport.sendMail(createForgotPasswordEmail(user.email, token));
            
            return res.status(200).json({ 
                success: true,
                message: "Password reset link sent to your email. Please check your inbox." 
            });
        } catch (emailError) {
            console.error("Error sending reset email:", emailError);
            return res.status(500).json({ 
                success: false,
                error: "Failed to send reset email. Please try again later." 
            });
        }

    } catch (error) {
        console.error("Error during forgot password:", error);
        return res.status(500).json({ 
            success: false,
            error: "Internal server error. Please try again later." 
        });
    }
}