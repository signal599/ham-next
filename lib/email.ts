import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

export async function sendMagicLinkEmail(to: string, magicLink: string): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM!,
    to,
    subject: "Your login link",
    text: [
      "Click this link to log in (expires in 15 minutes):",
      "",
      magicLink,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>Click the button below to log in. This link expires in <strong>15 minutes</strong>.</p>
      <p style="margin:24px 0">
        <a href="${magicLink}"
           style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">
          Log In
        </a>
      </p>
      <p style="color:#666;font-size:13px">Or copy this URL into your browser:<br>${magicLink}</p>
      <p style="color:#666;font-size:13px">If you did not request this, you can safely ignore this email.</p>
    `,
  });
}
