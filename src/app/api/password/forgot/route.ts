import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { consumeRateLimits, getClientIp } from "@/lib/rateLimit";
import { readJsonBody, InvalidJsonBodyError, PayloadTooLargeError } from "@/lib/readJsonBody";
import { normalizeEmail } from "@/lib/inputValidation";
import { sendPasswordResetEmail } from "@/lib/passwordResetEmail";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const genericResponse = {
  message: "Se houver uma conta com esse e-mail, enviaremos um link para redefinir a senha.",
};

function getPublicOrigin() {
  const configuredUrl = process.env.NEXTAUTH_URL;
  if (!configuredUrl) throw new Error("NEXTAUTH_URL is not configured");

  const url = new URL(configuredUrl);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("NEXTAUTH_URL must use HTTPS outside localhost");
  }
  return url.origin;
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ message: "Formato de requisição inválido." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    const status = error instanceof PayloadTooLargeError ? 413 : 400;
    const message = error instanceof InvalidJsonBodyError || error instanceof PayloadTooLargeError
      ? "Dados inválidos."
      : "Não foi possível processar a solicitação.";
    return NextResponse.json({ message }, { status });
  }

  const email = normalizeEmail(
    body && typeof body === "object" && "email" in body
      ? (body as { email?: unknown }).email
      : undefined,
  );
  const ip = getClientIp(request.headers);

  try {
    const rateLimit = await consumeRateLimits([
      { name: "password-forgot-ip", subject: ip, limit: 10, windowMs: 15 * 60 * 1000 },
      { name: "password-forgot-email", subject: `${ip}:${email ?? "invalid"}`, limit: 3, windowMs: 60 * 60 * 1000 },
    ]);
    if (!rateLimit.allowed) {
      return NextResponse.json(genericResponse, {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      });
    }

    if (!email) return NextResponse.json(genericResponse);

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
    if (!user?.email) return NextResponse.json(genericResponse);

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({
      where: { OR: [{ userId: user.id }, { expiresAt: { lt: new Date() } }] },
    });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const resetUrl = new URL("/forgot-password", getPublicOrigin());
    resetUrl.searchParams.set("token", token);
    try {
      await sendPasswordResetEmail(user.email, resetUrl.toString());
    } catch (error) {
      await prisma.passwordResetToken.deleteMany({ where: { tokenHash } });
      const details = error && typeof error === "object"
        ? error as { name?: unknown; code?: unknown }
        : {};
      console.error("[password/forgot] Falha no envio do e-mail", {
        name: typeof details.name === "string" ? details.name : "UnknownError",
        code: typeof details.code === "string" ? details.code : undefined,
      });
    }

    return NextResponse.json(genericResponse);
  } catch (error) {
    const details = error && typeof error === "object"
      ? error as { name?: unknown; code?: unknown }
      : {};
    console.error("[password/forgot] Falha ao processar solicitação", {
      name: typeof details.name === "string" ? details.name : "UnknownError",
      code: typeof details.code === "string" ? details.code : undefined,
    });
    return NextResponse.json(
      { message: "Não foi possível processar a solicitação agora. Tente novamente mais tarde." },
      { status: 503 },
    );
  }
}
