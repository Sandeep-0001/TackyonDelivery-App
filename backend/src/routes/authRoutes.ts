import express from 'express';
import passport from 'passport';
import { signUp, signIn, getCurrentUser, googleCallback, sendEmailOtp, verifyEmailOtp } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/otp/send', sendEmailOtp);
router.post('/otp/verify', verifyEmailOtp);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/signin' 
  }),
  googleCallback
);

// Protected route
router.get('/me', authMiddleware, getCurrentUser);

export default router;
