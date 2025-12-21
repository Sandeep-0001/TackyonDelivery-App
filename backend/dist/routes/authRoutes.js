"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.post('/signup', authController_1.signUp);
router.post('/signin', authController_1.signIn);
router.post('/otp/send', authController_1.sendEmailOtp);
router.post('/otp/verify', authController_1.verifyEmailOtp);
// Google OAuth routes
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback', passport_1.default.authenticate('google', {
    session: false,
    failureRedirect: '/signin'
}), authController_1.googleCallback);
// Protected route
router.get('/me', authMiddleware_1.authMiddleware, authController_1.getCurrentUser);
exports.default = router;
