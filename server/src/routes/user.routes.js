import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireOtpVerified } from '../middleware/requireOtpVerified.js';
import { setPhoneBody } from '../utils/validators.js';
import { User } from '../models/User.js';
import { sendOtp } from '../otp/otp.service.js';

const router = Router();

router.get('/', requireAuth, requireOtpVerified, async (req, res) => {
  const user = await User.findById(req.session.sub);
  return res.json({ user: { id: user._id, email: user.email, phone: user.phone, name: user.name, avatarUrl: user.avatarUrl } });
});

router.put('/phone', requireAuth, async (req, res) => {
  const { phone } = setPhoneBody.parse(req.body);
  const user = await User.findById(req.session.sub);
  user.phone = phone;
  user.phoneVerifiedAt = null; // must reverify
  await user.save();
  const { nonce, resendAt } = await sendOtp({ phone, purpose: 'signup' });
  return res.json({ ok: true, nonce, resendAt, message: 'Phone updated. Verify OTP to complete.' });
});

export default router;
