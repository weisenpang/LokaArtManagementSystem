import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

export var transport = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port:  465,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD
  }
});

export function createVerificationEmail(userEmail, token) {
    const verificationLink = `http://localhost:3000/guest/verify?token=${token}&email=${userEmail}`;
    return {
        from: 'artloka@lokaart.space',
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

export function createForgotPasswordEmail(userEmail, token) {
    const verificationLink = `http://localhost:3000/reset-password?token=${token}&email=${userEmail}`;
    return {
        from: 'artloka@lokaart.space',
        to: userEmail,
        subject: 'Verify your email to reset your password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Our App!</h2>
            <p>Please click the button below to reset your password:</p>
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
        text: `Please please reset your password: ${verificationLink}`
  };
}