import { User } from "../models/User.js";

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                error: "Please provide both current and new password" 
            });
        }

        // Enhanced password validation for new password
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: "New password must be at least 8 characters long" 
            });
        }

        if (!/[a-zA-Z]/.test(newPassword)) {
            return res.status(400).json({ 
                success: false,
                error: "New password must contain letters" 
            });
        }

        if (!/\d/.test(newPassword)) {
            return res.status(400).json({ 
                success: false,
                error: "New password must contain numbers" 
            });
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
            return res.status(400).json({ 
                success: false,
                error: "New password must contain special characters (!@#$%^&*)" 
            });
        }

        if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ 
                success: false,
                error: "New password must contain both uppercase and lowercase letters" 
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return res.status(401).json({ 
                success: false,
                error: "Current password is incorrect" 
            });
        }

        // Check if new password is different from current
        if (currentPassword === newPassword) {
            return res.status(400).json({ 
                success: false,
                error: "New password must be different from current password" 
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ 
            success: true,
            message: "Password changed successfully" 
        });

    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ 
            success: false,
            error: "Internal server error. Please try again later." 
        });
    }
};