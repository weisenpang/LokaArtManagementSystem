import {User} from "../models/User.js";

export async function verifyUser(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }

        // Find user by email first (without password check)
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                error: "No account found with this email address",
                redirectTo: "guest-signup.html"
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ 
                error: "Please verify your email address before signing in. Check your inbox for the verification link.",
                type: "unverified"
            });
        }
        
        // Check password (assuming you have password comparison method)
        if (user.password !== password) { // Replace with proper password comparison
            return res.status(401).json({ 
                error: "Invalid password. Please try again."
            });
        }
        
        // Successful login
        const sessionToken = user.generateSessionToken();
        console.log("Session token generated:", sessionToken);
        await user.save();
        
        const user_id = Object(user._id);
        
        // Return success with redirect URL instead of direct redirect
        res.redirect(301, `/${user.role}/${user_id}`);

    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ 
            error: "Server error. Please try again later." 
        });
    }
}