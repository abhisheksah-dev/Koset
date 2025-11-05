import { Router } from 'express';
import { strictLimiter } from '../middleware/rateLimit.js';
import { sendOtp, verifyOtp } from '../otp/otp.service.js';
import { sendOtpBody, verifyOtpBody } from '../utils/validators.js';
import { toErrorResponse } from '../utils/errors.js';
import { env } from '../config/env.js';
import { signSession, cookieOptions, verifySession } from '../auth/jwt.js';
import { User } from '../models/User.js';

const router = Router();

router.post('/send', strictLimiter, async (req, res) => {
  try {
    const { phone, context } = sendOtpBody.parse(req.body);
    const { nonce, resendAt, expiresAt } = await sendOtp({ phone, purpose: context });
    return res.json({ ok: true, nonce, resendAt, expiresAt });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

router.post('/verify', strictLimiter, async (req, res) => {
  try {
    const { phone, code, nonce } = verifyOtpBody.parse(req.body);
    await verifyOtp({ phone, code, nonce });

    // If a pre-auth cookie exists (from Google or prior step), upgrade it.
    const token = req.cookies[env.cookieName];
    let payload = null;
    if (token) {
      try { payload = verifySession(token); } catch {}
    }

    let user;
    if (payload?.sub) {
      user = await User.findById(payload.sub);
      if (user && !user.phone) {
        // if user had no phone, attach it and mark verified
        user.phone = phone;
        user.phoneVerifiedAt = new Date();
        await user.save();
      }
    } else {
      // Phone-only flow: find or create user by phone
      user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({ phone, phoneVerifiedAt: new Date() });
      }
    }

    const upgraded = signSession({
      sub: String(user._id),
      email: user.email || null,
      otpVerifiedAt: new Date().toISOString()
    }, 60 * 60 * 24 * 7); // 7d

    res.cookie(env.cookieName, upgraded, cookieOptions(1000 * 60 * 60 * 24 * 7));
    return res.json({ ok: true, otpVerifiedAt: new Date().toISOString(), user: { id: user._id, phone: user.phone, email: user.email, name: user.name } });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

export default router;
