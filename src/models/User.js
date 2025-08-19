import mongoose from "mongoose";
import { randomBytes } from "crypto";

const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: false
        },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true
        },
        password: { 
            type: String, 
            required: true 
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },
        role: {
            type: String,
            enum: ['user','staff', 'admin'],
            default: 'user'
        },
        verificationToken: String,
        verificationTokenExpires: Date,
        sessionToken: String,
        sessionTokenExpires: Date
    },
    {timestamps: true}
);

userSchema.methods.generateVerificationToken = function() {
  this.verificationToken = randomBytes(20).toString('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return this.verificationToken;
};

userSchema.methods.generateSessionToken = function() {
  this.sessionToken = randomBytes(20).toString('hex');
  this.sessionTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return this.sessionToken;
};

export const User = mongoose.model("User", userSchema)
export const userVerify = async (email, token, res) => {
    try{
        const user = await User.findOne({ 
            email, 
            verificationToken: token, 
            verificationTokenExpires: { $gt: Date.now() } 
        });
        console.log("user found", user);
        if (!user) {
            res.status(400).send("Email verification failed. Please try again."); 
            return false; // User not found or token expired
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        return true; // Verification successful
    }catch (error) {
        console.error("Error during verification:", error);
    }
}

export const UserTokenTerminate = async (user_id) => {
    try {
        const user = await User.findOne({ 
            _id: user_id, 
            sessionTokenExpires: { $gt: Date.now() }
        });
        if (!user) {
            console.log("User not found or token invalid");
            return false; // User not found or token invalid
        }
        user.sessionToken = undefined;
        user.sessionTokenExpires = undefined;
        await user.save();
        return true
    } catch (error) {
        console.error("Error during token termination:", error);
    }
}