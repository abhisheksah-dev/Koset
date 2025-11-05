import mongoose from 'mongoose';

const OAuthAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  provider: { type: String, enum: ['google'], required: true },
  providerId: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() }
});

OAuthAccountSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const OAuthAccount = mongoose.model('OAuthAccount', OAuthAccountSchema);
