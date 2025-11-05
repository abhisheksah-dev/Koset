import { env } from '../config/env.js';
import { verifySession } from '../auth/jwt.js';

export function requireAuth(req, res, next) {
  const token = req.cookies[env.cookieName];
  if (!token) return res.status(401).json({ error: { code: 'NO_AUTH', message: 'Not authenticated' } });
  try {
    const payload = verifySession(token);
    req.session = payload;
    return next();
  } catch {
    return res.status(401).json({ error: { code: 'BAD_TOKEN', message: 'Invalid session' } });
  }
}
