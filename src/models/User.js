import mongoose from "mongoose";
import { randomBytes } from "crypto";

const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true
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
        verificationToken: String,
        verificationTokenExpires: Date
    },
    {timestamps: true}
);

userSchema.methods.generateVerificationToken = function() {
  this.verificationToken = randomBytes(20).toString('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return this.verificationToken;
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
            console.log("User not found or token expired");
            return false; // User not found or token expired
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        return true
    }catch (error) {
        console.error("Error during verification:", error);
    }
}
