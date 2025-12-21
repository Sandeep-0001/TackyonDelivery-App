"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailOtp = exports.sendEmailOtp = exports.googleCallback = exports.getCurrentUser = exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const emailService_1 = require("../services/emailService");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// Sign Up
const signUp = async (req, res) => {
    try {
        const { email, password, name, code } = req.body;
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        if (!code) {
            return res.status(400).json({ message: 'OTP code is required to complete signup' });
        }
        const normalizedEmail = String(email).toLowerCase().trim();
        const now = new Date();
        const otpDoc = await otpModel_1.default.findOne({ email: normalizedEmail, purpose: 'verify_email' }).sort({ createdAt: -1 });
        if (!otpDoc) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }
        if (otpDoc.expiresAt <= now) {
            await otpModel_1.default.deleteOne({ _id: otpDoc._id });
            return res.status(400).json({ message: 'Code has expired' });
        }
        if (otpDoc.attempts >= Number(process.env.OTP_MAX_ATTEMPTS || 5)) {
            await otpModel_1.default.deleteOne({ _id: otpDoc._id });
            return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
        }
        const match = await bcryptjs_1.default.compare(code, otpDoc.codeHash);
        if (!match) {
            otpDoc.attempts += 1;
            await otpDoc.save();
            return res.status(400).json({ message: 'Invalid code' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new userModel_1.default({
            email: normalizedEmail,
            password: hashedPassword,
            name,
            emailVerified: true
        });
        await user.save();
        await otpModel_1.default.deleteMany({ email: normalizedEmail, purpose: 'verify_email' });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ message: 'Server error during sign up' });
    }
};
exports.signUp = signUp;
// Sign In
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.emailVerified) {
            return res.status(403).json({ message: 'Email not verified. Please verify your email to continue.' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            message: 'Sign in successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ message: 'Server error during sign in' });
    }
};
exports.signIn = signIn;
// Get Current User
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId; // Set by auth middleware
        const user = await userModel_1.default.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCurrentUser = getCurrentUser;
// Google OAuth Callback
const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${FRONTEND_URL}/signin?error=authentication_failed`);
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Redirect to frontend with token
        res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            email: user.email,
            name: user.name
        }))}`);
    }
    catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${FRONTEND_URL}/signin?error=server_error`);
    }
};
exports.googleCallback = googleCallback;
// Send Email OTP
const sendEmailOtp = async (req, res) => {
    try {
        const { email, purpose } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const normalizedEmail = String(email).toLowerCase().trim();
        // Generate a 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeHash = await bcryptjs_1.default.hash(code, 10);
        const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 10);
        const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
        // Clear previous OTPs for this email/purpose
        await otpModel_1.default.deleteMany({ email: normalizedEmail, purpose: purpose || 'verify_email' });
        await otpModel_1.default.create({
            email: normalizedEmail,
            codeHash,
            expiresAt,
            purpose: purpose || 'verify_email',
            attempts: 0,
        });
        const appName = process.env.APP_NAME || 'RouteOptimizer';
        const subject = `${appName} verification code`;
        const html = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2>${appName}</h2>
        <p>Your verification code is:</p>
        <p style="font-size:24px;letter-spacing:4px;font-weight:bold">${code}</p>
        <p>This code will expire in ${ttlMinutes} minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;
        await (0, emailService_1.sendEmail)(normalizedEmail, subject, html);
        res.status(200).json({ message: 'OTP sent to email' });
    }
    catch (error) {
        console.error('Send Email OTP error:', error);
        res.status(500).json({ message: 'Server error while sending OTP' });
    }
};
exports.sendEmailOtp = sendEmailOtp;
const verifyEmailOtp = async (req, res) => {
    try {
        const { email, code, purpose } = req.body;
        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code are required' });
        }
        const normalizedEmail = String(email).toLowerCase().trim();
        const now = new Date();
        const otpDoc = await otpModel_1.default.findOne({ email: normalizedEmail, purpose: purpose || 'verify_email' }).sort({ createdAt: -1 });
        if (!otpDoc) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }
        if (otpDoc.expiresAt <= now) {
            await otpModel_1.default.deleteOne({ _id: otpDoc._id });
            return res.status(400).json({ message: 'Code has expired' });
        }
        if (otpDoc.attempts >= Number(process.env.OTP_MAX_ATTEMPTS || 5)) {
            await otpModel_1.default.deleteOne({ _id: otpDoc._id });
            return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
        }
        const match = await bcryptjs_1.default.compare(code, otpDoc.codeHash);
        if (!match) {
            otpDoc.attempts += 1;
            await otpDoc.save();
            return res.status(400).json({ message: 'Invalid code' });
        }
        // Success: mark email verified if this is for verification
        if (!purpose || purpose === 'verify_email') {
            const user = await userModel_1.default.findOne({ email: normalizedEmail });
            if (user) {
                user.emailVerified = true;
                await user.save();
            }
        }
        await otpModel_1.default.deleteMany({ email: normalizedEmail, purpose: purpose || 'verify_email' });
        res.status(200).json({ message: 'Email verified successfully' });
    }
    catch (error) {
        console.error('Verify Email OTP error:', error);
        res.status(500).json({ message: 'Server error while verifying OTP' });
    }
};
exports.verifyEmailOtp = verifyEmailOtp;
