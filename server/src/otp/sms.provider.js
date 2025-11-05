import twilio from 'twilio';
import { env } from '../config/env.js';

const client = twilio(env.twilio.sid, env.twilio.token);

export async function sendSms(to, body) {
  // In production, add sender reputation checks and error handling
  const msg = await client.messages.create({
    to,
    from: env.twilio.from,
    body
  });
  return msg.sid;
}
