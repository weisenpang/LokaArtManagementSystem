import { User } from "../models/User.js";
import { filePath } from '../config/filePath.js';

export const resetPassword = async (req, res) => {
    try {
        const { email, token } = req.query;
        
        // Validate that we have both email and token
        if (!email || !token) {
            return res.status(400).json({
                success: false,
                error: "Invalid reset link. Please request a new password reset."
            });
        }
        
        // Verify the token is valid and not expired
        const user = await User.findOne({ 
            email,
            verificationToken: token, 
            verificationTokenExpires: { $gt: Date.now() } 
        });
        
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Reset link has expired or is invalid. Please request a new password reset."
            });
        }
        
        res.sendFile(filePath('ResetPassword.html'));
        
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { password, email, token } = req.body;

        // Validate input
        if (!password || !email || !token) {
            return res.status(400).json({ 
                success: false,
                error: "Missing required fields" 
            });
        }

        // Enhanced password validation (same as signup)
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: "Password must be at least 8 characters long" 
            });
        }

        // Check for letters
        if (!/[a-zA-Z]/.test(password)) {
            return res.status(400).json({ 
                success: false,
                error: "Password must contain letters" 
            });
        }

        // Check for numbers
        if (!/\d/.test(password)) {
            return res.status(400).json({ 
                success: false,
                error: "Password must contain numbers" 
            });
        }

        // Check for special characters
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return res.status(400).json({ 
                success: false,
                error: "Password must contain special characters (!@#$%^&*)" 
            });
        }

        // Check for mix of uppercase and lowercase
        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            return res.status(400).json({ 
                success: false,
                error: "Password must contain both uppercase and lowercase letters" 
            });
        }

        const user = await User.findOne({ 
            email,
            verificationToken: token, 
            verificationTokenExpires: { $gt: Date.now() } 
        });
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "Reset link has expired or is invalid" 
            });
        }

        // Update password and clear reset token
        user.password = password;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        user.isVerified = true; // Ensure user is verified
        await user.save();
        
        return res.status(200).json({ 
            success: true,
            message: "Password updated successfully" 
        });
        
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
}