import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { consumeRateLimits, getClientIp } from "@/lib/rateLimit";
import { isValidRegistrationPassword } from "@/lib/inputValidation";
import { readJsonBody, InvalidJsonBodyError, PayloadTooLargeError } from "@/lib/readJsonBody";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const invalidTokenResponse = {
  message: "Este link é inválido ou expirou. Solicite uma nova redefinição de senha.",
};

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

  const values = body && typeof body === "object"
    ? body as { token?: unknown; password?: unknown }
    : {};
  if (
    typeof values.token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(values.token) ||
    !isValidRegistrationPassword(values.password)
  ) {
    return NextResponse.json(
      { message: "Informe um link válido e uma senha com pelo menos 8 caracteres (máximo de 72 bytes)." },
      { status: 400 },
    );
  }

  try {
    const rateLimit = await consumeRateLimits([
      { name: "password-reset-ip", subject: getClientIp(request.headers), limit: 10, windowMs: 15 * 60 * 1000 },
    ]);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Muitas tentativas. Tente novamente mais tarde." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const tokenHash = createHash("sha256").update(values.token).digest("hex");
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { tokenHash, expiresAt: { gt: new Date() } },
      select: { id: true, userId: true },
    });
    if (!resetToken) return NextResponse.json(invalidTokenResponse, { status: 400 });

    const hashedPassword = await bcrypt.hash(values.password, 12);
    await prisma.$transaction(async (transaction) => {
      const consumedToken = await transaction.passwordResetToken.deleteMany({
        where: { id: resetToken.id, expiresAt: { gt: new Date() } },
      });
      if (consumedToken.count !== 1) throw new Error("RESET_TOKEN_ALREADY_USED");

      await transaction.user.update({
        where: { id: resetToken.userId },
        data: { hashedPassword, update_at: new Date() },
      });
      await transaction.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } });
    });

    return NextResponse.json({ message: "Senha redefinida com sucesso. Você já pode entrar com a nova senha." });
  } catch (error) {
    if (error instanceof Error && error.message === "RESET_TOKEN_ALREADY_USED") {
      return NextResponse.json(invalidTokenResponse, { status: 400 });
    }
    const details = error && typeof error === "object"
      ? error as { name?: unknown; code?: unknown }
      : {};
    console.error("[password/reset] Falha ao redefinir senha", {
      name: typeof details.name === "string" ? details.name : "UnknownError",
      code: typeof details.code === "string" ? details.code : undefined,
    });
    return NextResponse.json(
      { message: "Não foi possível redefinir a senha agora. Tente novamente mais tarde." },
      { status: 503 },
    );
  }
}
