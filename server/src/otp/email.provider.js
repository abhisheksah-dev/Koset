import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.emailUser,
    pass: env.emailPass
  }
});

export async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: env.emailUser,
    to,
    subject,
    text
  });
}
