import {User} from "../models/User.js";

export async function verifyUser(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Missing fields!" });
        }

        // Find user by email
        const user = await User.findOne({ email, isVerified: true , password});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "Email not verified" });
        }
        
        // Successful login
        const sessionToken = user.generateSessionToken();
        console.log("Session token generated:", sessionToken);
        await user.save();
        const user_id = Object(user._id);
        res.redirect(301, `/staff/${user_id}`); // Redirect to dashboard after successful login

    } catch (error) {
        console.error("Error during sign-in:", error);
        
    }
}