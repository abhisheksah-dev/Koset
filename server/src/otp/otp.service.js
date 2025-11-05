import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import { OtpCode } from '../models/OtpCode.js';
import { sendSms } from './sms.provider.js';

function makeCode(length) {
  const digits = '0123456789';
  let out = '';
  for (let i = 0; i < length; i++) out += digits[Math.floor(Math.random() * 10)];
  return out;
}

function hashCode(code, salt) {
  return crypto.createHmac('sha256', salt).update(code).digest('hex');
}

export async function sendOtp({ phone, purpose }) {
  const now = new Date();
  const existing = await OtpCode.findOne({ phone, purpose }).sort({ createdAt: -1 });

  if (existing) {
    if (existing.resendAvailableAt > now) {
      const ms = existing.resendAvailableAt - now;
      throw { code: 'RESEND_TOO_SOON', message: `Wait ${Math.ceil(ms/1000)}s before resending.` };
    }
    // 15m window enforcement
    const window15m = new Date(now.getTime() - 15 * 60 * 1000);
    const countInWindow = await OtpCode.countDocuments({
      phone, purpose, createdAt: { $gte: window15m }
    });
    if (countInWindow >= env.otp.sendMax15m) {
      throw { code: 'SEND_RATE_LIMIT', message: 'Too many OTP sends. Try later.' };
    }
  }

  const code = makeCode(env.otp.length);
  const salt = crypto.randomBytes(16).toString('hex');
  const codeHash = hashCode(code, salt);
  const nonce = uuidv4();

  const resendAvailableAt = new Date(now.getTime() + env.otp.resendWindowSec * 1000);
  const expiresAt = new Date(now.getTime() + env.otp.ttlSec * 1000);

  await OtpCode.create({
    phone, purpose, nonce, codeHash, salt, resendAvailableAt, expiresAt
  });

  await sendSms(phone, `Your verification code is ${code}. It expires in ${Math.floor(env.otp.ttlSec/60)} minutes.`);

  return { nonce, resendAt: resendAvailableAt.toISOString(), expiresAt: expiresAt.toISOString() };
}

export async function verifyOtp({ phone, code, nonce }) {
  const now = new Date();
  const record = await OtpCode.findOne({ phone, nonce, consumedAt: null }).sort({ createdAt: -1 });
  if (!record) throw { code: 'OTP_NOT_FOUND', message: 'OTP not found or already used.' };
  if (record.expiresAt < now) throw { code: 'OTP_EXPIRED', message: 'OTP expired.' };

  // enforce verify attempts
  const window15m = new Date(now.getTime() - 15 * 60 * 1000);
  const attempts = await OtpCode.aggregate([
    { $match: { phone, createdAt: { $gte: window15m } } },
    { $group: { _id: null, total: { $sum: "$verifyAttemptCount15m" } } }
  ]);
  const totalAttempts = attempts[0]?.total || 0;
  if (totalAttempts >= env.otp.verifyMax15m) {
    throw { code: 'VERIFY_RATE_LIMIT', message: 'Too many attempts. Try later.' };
  }

  // verify hash
  const candidateHash = crypto.createHmac('sha256', record.salt).update(code).digest('hex');
  const ok = crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(record.codeHash, 'hex'));
  // increment attempts counter on this record regardless (defense)
  record.verifyAttemptCount15m += 1;
  await record.save();

  if (!ok) throw { code: 'INVALID_CODE', message: 'Invalid code.' };

  // mark consumed
  record.consumedAt = new Date();
  await record.save();
  return { ok: true };
}
