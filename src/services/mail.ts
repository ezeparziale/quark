"use server"

import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

export async function sendMail(toEmail: string, subject: string, html: string) {
  var transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secureConnection: process.env.MAIL_USE_TLS,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as SMTPTransport.Options)

  var mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: toEmail,
    subject: subject,
    html: html,
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    return false
  }
}
