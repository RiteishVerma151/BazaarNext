
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const name = profile.displayName?.trim();
        const emailVerified = profile._json?.email_verified === true;

        if (!email || !emailVerified || !name) {
          return done(null, false, {
            message: "Google account must have a verified email and name.",
          });
        }

        let user = await User.findOne({
          $or: [{ googleId }, { email }],
        });

        if (user) {
          if (user.isBlocked) {
            return done(null, false, {
              message: "Your account has been blocked.",
            });
          }

          if (user.googleId && user.googleId !== googleId) {
            return done(null, false, {
              message: "This email is linked to another Google account.",
            });
          }

          // Link Google to an existing account with the same verified email.
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
        } else {
          user = await User.create({
            name,
            email,
            googleId,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
