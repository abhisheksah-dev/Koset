import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env.js";
import { EmailOtpCode } from "../models/EmailOtpCode.js";
import { sendEmail } from "./email.provider.js";

function makeCode(length) {
  return [...Array(length)].map(() => Math.floor(Math.random()*10)).join("");
}

export async function sendEmailOtp({ email, purpose }) {
  const code = makeCode(env.otp.length);
  const salt = crypto.randomBytes(16).toString("hex");
  const codeHash = crypto.createHmac("sha256", salt).update(code).digest("hex");
  const nonce = uuidv4();

  const expiresAt = new Date(Date.now() + env.otp.ttlSec * 1000);

  await EmailOtpCode.create({ email, purpose, nonce, codeHash, salt, expiresAt });

  await sendEmail(email, "Your Login OTP", `Your OTP code is ${code}. Valid for 5 minutes.`);

  return { nonce, expiresAt };
}

export async function verifyEmailOtp({ email, code, nonce }) {
  const record = await EmailOtpCode.findOne({ email, nonce, consumedAt: null });
  if (!record) throw { code: "OTP_NOT_FOUND", message: "OTP invalid or expired" };
  if (record.expiresAt < new Date()) throw { code: "OTP_EXPIRED", message: "OTP expired" };

  const candidateHash = crypto.createHmac("sha256", record.salt).update(code).digest("hex");
  if (candidateHash !== record.codeHash) throw { code: "INVALID_CODE", message: "Wrong OTP" };

  record.consumedAt = new Date();
  await record.save();

  return { ok: true };
}
