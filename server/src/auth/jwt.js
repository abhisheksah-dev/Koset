import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signSession(payload, ttlSec = 60 * 60 * 24 * 7) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: ttlSec });
}

export function verifySession(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    domain: env.cookieDomain,
    path: '/',
    maxAge: maxAgeMs
  };
}
