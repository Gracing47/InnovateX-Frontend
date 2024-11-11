import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, scores, totalScore, role } = req.body

    // Create transporter (replace with your email service details)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Ihre Digital Fit Check Auswertung',
      html: `
        <h1>Ihre Digital Fit Check Auswertung</h1>
        <p>Rolle: ${role}</p>
        <p>Gesamtpunktzahl: ${totalScore}/75</p>
        ${scores?.map(score => `
          <p>${score.category}: ${score.points}/${score.maxPoints}</p>
        `).join('')}
      `,
    })

    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ message: 'Failed to send email' })
  }
} 