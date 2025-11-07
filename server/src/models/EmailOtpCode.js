import mongoose from "mongoose";

const EmailOtpCodeSchema = new mongoose.Schema({
  email: { type: String, index: true },
  purpose: { type: String, enum: ["signin", "signup"], required: true },
  nonce: { type: String, index: true },
  codeHash: { type: String, required: true },
  salt: { type: String, required: true },
  expiresAt: { type: Date, index: true },
  consumedAt: { type: Date },
  createdAt: { type: Date, default: () => new Date() }
});

export const EmailOtpCode = mongoose.model("EmailOtpCode", EmailOtpCodeSchema);
