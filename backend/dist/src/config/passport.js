"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userModel_1 = __importDefault(require("../models/userModel"));
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
function normalizeBaseUrl(url) {
    return url.trim().replace(/\/+$/, '');
}
const BACKEND_BASE_URL = normalizeBaseUrl(process.env.BACKEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    'http://localhost:3001');
const GOOGLE_CALLBACK_URL = (process.env.GOOGLE_CALLBACK_URL && process.env.GOOGLE_CALLBACK_URL.trim())
    ? process.env.GOOGLE_CALLBACK_URL.trim()
    : `${BACKEND_BASE_URL}/api/auth/google/callback`;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await userModel_1.default.findOne({ email: profile.emails?.[0].value });
        if (user) {
            // User exists, return user
            return done(null, user);
        }
        // Create new user
        user = new userModel_1.default({
            email: profile.emails?.[0].value,
            name: profile.displayName,
            password: Math.random().toString(36).slice(-8), // Random password for Google users
            googleId: profile.id,
        });
        await user.save();
        return done(null, user);
    }
    catch (error) {
        return done(error, undefined);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await userModel_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
