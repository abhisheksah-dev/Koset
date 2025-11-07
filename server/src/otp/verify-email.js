import { Router } from 'express';
import { strictLimiter } from '../middleware/rateLimit.js';
import { sendOtp, verifyOtp } from '../otp/otp.service.js';
import { sendEmailOtp, verifyEmailOtp } from '../otp/emailOtp.service.js';
import { sendOtpBody, verifyOtpBody } from '../utils/validators.js';
import { toErrorResponse } from '../utils/errors.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { signSession, cookieOptions, verifySession } from '../auth/jwt.js';

const router = Router();

// SMS OTP SEND
router.post('/send', strictLimiter, async (req, res) => {
  try {
    const { phone, context } = sendOtpBody.parse(req.body);
    const { nonce, resendAt, expiresAt } = await sendOtp({ phone, purpose: context });
    return res.json({ ok: true, nonce, resendAt, expiresAt });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

// SMS OTP VERIFY (phone)
router.post('/verify', strictLimiter, async (req, res) => {
  try {
    const { phone, code, nonce } = verifyOtpBody.parse(req.body);
    await verifyOtp({ phone, code, nonce });

    const token = req.cookies[env.cookieName];
    let payload = null;
    if (token) { try { payload = verifySession(token); } catch {} }

    let user;
    if (payload?.sub) user = await User.findById(payload.sub);
    else user = await User.findOne({ phone }) || await User.create({ phone, phoneVerifiedAt: new Date() });

    const upgraded = signSession({
      sub: String(user._id),
      email: user.email || null,
      otpVerifiedAt: new Date().toISOString()
    }, 60 * 60 * 24 * 7);

    res.cookie(env.cookieName, upgraded, cookieOptions(1000 * 60 * 60 * 24 * 7));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

// ✅ NEW — EMAIL OTP VERIFY
router.post('/verify-email', strictLimiter, async (req, res) => {
  try {
    const { email, code, nonce } = req.body;
    await verifyEmailOtp({ email, code, nonce });

    const user = await User.findOne({ email });
    const upgraded = signSession({
      sub: String(user._id),
      email,
      otpVerifiedAt: new Date().toISOString()
    }, 60 * 60 * 24 * 7);

    res.cookie(env.cookieName, upgraded, cookieOptions(1000 * 60 * 60 * 24 * 7));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

export default router;
