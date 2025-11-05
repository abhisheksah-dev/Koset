export function requireOtpVerified(req, res, next) {
  if (!req.session?.otpVerifiedAt) {
    return res.status(403).json({ error: { code: 'OTP_REQUIRED', message: 'OTP not verified for this session' } });
  }
  return next();
}
