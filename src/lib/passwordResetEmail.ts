import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !password || !from) {
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Redefinição de senha",
    text: `Recebemos uma solicitação para redefinir a senha da sua conta. Acesse este link em até 30 minutos: ${resetUrl}\n\nSe você não solicitou a redefinição, ignore esta mensagem.`,
    html: `<p>Recebemos uma solicitação para redefinir a senha da sua conta.</p><p><a href="${resetUrl}">Criar uma nova senha</a></p><p>O link expira em 30 minutos. Se você não solicitou a redefinição, ignore esta mensagem.</p>`,
  });
}
