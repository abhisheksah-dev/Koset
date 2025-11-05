import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { OAuthAccount } from '../models/OAuthAccount.js';

passport.use(new GoogleStrategy({
  clientID: env.google.clientId,
  clientSecret: env.google.clientSecret,
  callbackURL: env.google.callbackUrl
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const providerId = profile.id;
    let account = await OAuthAccount.findOne({ provider: 'google', providerId });
    let user;

    if (!account) {
      // Try match by email if present
      const email = profile.emails?.[0]?.value?.toLowerCase();
      user = await User.findOne({ email }) || new User({
        email,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value
      });
      await user.save();

      account = await OAuthAccount.create({
        userId: user._id,
        provider: 'google',
        providerId
      });

      // also store in user.providers for quick lookup
      user.providers.google = { id: providerId };
      await user.save();
    } else {
      user = await User.findById(account.userId);
    }

    // Pass user forward; OTP still needed
    return done(null, user);
  } catch (e) {
    return done(e);
  }
}));

export default passport;
