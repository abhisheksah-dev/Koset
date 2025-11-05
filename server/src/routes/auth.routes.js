import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { signSession, cookieOptions } from '../auth/jwt.js';
import { sendOtp } from '../otp/otp.service.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${env.frontendOrigin}/login?err=google_failed` }),
  async (req, res) => {
    // Here, req.user is the User from passport strategy.
    const user = req.user;

    // Create a session with otpVerifiedAt = null (OTP pending)
    const token = signSession({
      sub: String(user._id),
      email: user.email,
      otpVerifiedAt: null
    }, 60 * 60 * 6); // 6h

    res.cookie(env.cookieName, token, cookieOptions(1000 * 60 * 60 * 6));

    // If user has phone, send OTP. If not, redirect to onboarding.
    if (user.phone) {
      const { nonce } = await sendOtp({ phone: user.phone, purpose: 'signin' });
      return res.redirect(`${env.frontendOrigin}/otp?phone=${encodeURIComponent(user.phone)}&nonce=${nonce}`);
    } else {
      return res.redirect(`${env.frontendOrigin}/onboarding/phone`);
    }
  }
);

export default router;
