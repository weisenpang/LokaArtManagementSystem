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

const User = mongoose.model("User", userSchema)

export default User