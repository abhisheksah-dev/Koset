import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  jti: { type: String, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  otpVerifiedAt: { type: Date }, // must be set before full access
  userAgent: { type: String },
  ip: { type: String },
  expiresAt: { type: Date, index: true },
  createdAt: { type: Date, default: () => new Date() }
});

export const Session = mongoose.model('Session', SessionSchema);
