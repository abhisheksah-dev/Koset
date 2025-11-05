import mongoose from 'mongoose';

const OtpCodeSchema = new mongoose.Schema({
  phone: { type: String, index: true },
  purpose: { type: String, enum: ['signin', 'signup', 'stepup'], required: true },
  nonce: { type: String, index: true }, // binds send+verify
  codeHash: { type: String, required: true },
  salt: { type: String, required: true },
  resendAvailableAt: { type: Date, required: true },
  expiresAt: { type: Date, index: true },
  consumedAt: { type: Date },
  sendCount15m: { type: Number, default: 1 },
  verifyAttemptCount15m: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => new Date() }
});

export const OtpCode = mongoose.model('OtpCode', OtpCodeSchema);
