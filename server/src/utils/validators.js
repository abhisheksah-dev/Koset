import { z } from 'zod';

export const phoneSchema = z.string().regex(/^\+[1-9]\d{6,14}$/, 'Phone must be E.164');
const contextEnum = z.enum(['signin', 'signup', 'stepup']);

// Phone Schemas
export const sendOtpBody = z.object({
  phone: phoneSchema,
  context: contextEnum
});

export const verifyOtpBody = z.object({
  phone: phoneSchema,
  code: z.string().length(6),
  nonce: z.string().uuid()
});

export const setPhoneBody = z.object({
  phone: phoneSchema
});

// Email Schemas
export const emailSchema = z.string().email('Invalid email address');

export const sendEmailOtpBody = z.object({
  email: emailSchema,
  context: contextEnum
});

export const verifyEmailOtpBody = z.object({
  email: emailSchema,
  code: z.string().length(6),
  nonce: z.string().uuid()
});