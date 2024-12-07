"use server"

import { env } from "@/env.mjs"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

export async function sendMail(toEmail: string, subject: string, html: string) {
  var transporter = nodemailer.createTransport({
    host: env.MAIL_SERVER,
    port: env.MAIL_PORT,
    secureConnection: env.MAIL_USE_TLS,
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as SMTPTransport.Options)

  var mailOptions = {
    from: env.MAIL_USERNAME,
    to: toEmail,
    subject: subject,
    html: html,
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch {
    return false
  }
}
