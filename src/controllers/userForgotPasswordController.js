import { User } from "../models/User.js";
import { createForgotPasswordEmail } from "../Utils/Email.js";
import { transport } from "../Utils/Email.js";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return 
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Generate a password reset token
        const token = user.generateVerificationToken();
        console.log("Generated token:", token);
        await user.save();
        await transport.sendMail(createForgotPasswordEmail(user.email, token));
        res.status(200).json({ message: "Password reset link sent to your email." });
        return true;
        

    } catch (error) {
        console.error("Error during forgot password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}