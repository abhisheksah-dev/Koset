import { z } from 'zod';

export const phoneSchema = z.string().regex(/^\+[1-9]\d{6,14}$/, 'Phone must be E.164');
export const sendOtpBody = z.object({
  phone: phoneSchema,
  context: z.enum(['signin', 'signup', 'stepup'])
});

export const verifyOtpBody = z.object({
  phone: phoneSchema,
  code: z.string().length(6),
  nonce: z.string().uuid()
});

export const setPhoneBody = z.object({
  phone: phoneSchema
});
