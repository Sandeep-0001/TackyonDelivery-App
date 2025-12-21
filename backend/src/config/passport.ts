import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Create new user
        user = new User({
          email: profile.emails?.[0].value,
          name: profile.displayName,
          password: Math.random().toString(36).slice(-8), // Random password for Google users
          googleId: profile.id,
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
