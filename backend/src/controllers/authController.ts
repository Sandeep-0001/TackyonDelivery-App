import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import EmailOtp from '../models/otpModel';
import { sendEmail } from '../services/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Sign Up
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, code } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    if (!code) {
      return res.status(400).json({ message: 'OTP code is required to complete signup' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const now = new Date();
    const otpDoc = await EmailOtp.findOne({ email: normalizedEmail, purpose: 'verify_email' }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (otpDoc.expiresAt <= now) {
      await EmailOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: 'Code has expired' });
    }
    if (otpDoc.attempts >= Number(process.env.OTP_MAX_ATTEMPTS || 5)) {
      await EmailOtp.deleteOne({ _id: otpDoc._id });
      return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
    }

    const match = await bcrypt.compare(code, otpDoc.codeHash);
    if (!match) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: 'Invalid code' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      emailVerified: true
    });

    await user.save();

    await EmailOtp.deleteMany({ email: normalizedEmail, purpose: 'verify_email' });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Server error during sign up' });
  }
};

// Sign In
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email to continue.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Sign in successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Server error during sign in' });
  }
};

// Get Current User
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Set by auth middleware
    
    const user = await User.findById(userId).select('-password');
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
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Google OAuth Callback
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      return res.redirect(`${FRONTEND_URL}/signin?error=authentication_failed`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name
    }))}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${FRONTEND_URL}/signin?error=server_error`);
  }
};

// Send Email OTP
export const sendEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email, purpose } = req.body as { email: string; purpose?: string };
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Generate a 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 10);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // Clear previous OTPs for this email/purpose
    await EmailOtp.deleteMany({ email: normalizedEmail, purpose: purpose || 'verify_email' });

    await EmailOtp.create({
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
    await sendEmail(normalizedEmail, subject, html);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Send Email OTP error:', error);
    try {
      const { email, purpose } = req.body as { email?: string; purpose?: string };
      const normalizedEmail = (email ? String(email).toLowerCase().trim() : '');
      if (normalizedEmail) {
        await EmailOtp.deleteMany({ email: normalizedEmail, purpose: purpose || 'verify_email' });
      }
    } catch {
      // ignore cleanup errors
    }

    const isProd = (process.env.NODE_ENV || 'development') === 'production';
    const safeError = (error && typeof error === 'object' && 'message' in (error as any))
      ? String((error as any).message)
      : undefined;

    res.status(500).json({
      message: 'Failed to send OTP email',
      ...(isProd ? {} : { error: safeError }),
    });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email, code, purpose } = req.body as { email: string; code: string; purpose?: string };
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const now = new Date();
    const otpDoc = await EmailOtp.findOne({ email: normalizedEmail, purpose: purpose || 'verify_email' }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (otpDoc.expiresAt <= now) {
      await EmailOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: 'Code has expired' });
    }
    if (otpDoc.attempts >= Number(process.env.OTP_MAX_ATTEMPTS || 5)) {
      await EmailOtp.deleteOne({ _id: otpDoc._id });
      return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
    }

    const match = await bcrypt.compare(code, otpDoc.codeHash);
    if (!match) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Success: mark email verified if this is for verification
    if (!purpose || purpose === 'verify_email') {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        user.emailVerified = true;
        await user.save();
      }
    }

    await EmailOtp.deleteMany({ email: normalizedEmail, purpose: purpose || 'verify_email' });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify Email OTP error:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};
