import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/en/auth/verify?token=${token}`;
  const from = process.env.SMTP_FROM ?? 'Arita Catalog <no-reply@example.com>';

  const transporter = createTransporter();

  await transporter.sendMail({
    from,
    to,
    subject: 'Verify your Arita Catalog email',
    text: `Hello ${name},\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nArita Catalog Team`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #004191;">Arita Catalog</h2>
        <p>Hello ${name},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#004191;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
          Verify Email
        </a>
        <p style="margin-top:16px;color:#666;">Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
        <p style="color:#666;">This link expires in 24 hours.</p>
        <hr style="border:none;border-top:1px solid #eee;margin-top:24px;"/>
        <p style="color:#999;font-size:12px;">Arita Catalog Team</p>
      </div>
    `,
  });
}
