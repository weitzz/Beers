import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { isValidRegistrationPassword, normalizeEmail, normalizeUsername } from '@/lib/inputValidation'
import { consumeRateLimits, getClientIp } from '@/lib/rateLimit'

const MAX_BODY_BYTES = 4 * 1024

class PayloadTooLargeError extends Error {}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    const declaredLength = Number(contentLength)
    if (!Number.isSafeInteger(declaredLength) || declaredLength < 0) {
      throw new SyntaxError('Invalid Content-Length')
    }
    if (declaredLength > MAX_BODY_BYTES) throw new PayloadTooLargeError()
  }

  const reader = request.body?.getReader()
  if (!reader) throw new SyntaxError('Missing request body')

  const chunks: Uint8Array[] = []
  let totalBytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel()
        throw new PayloadTooLargeError()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const body = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body)) as unknown
  } catch {
    throw new SyntaxError('Invalid JSON body')
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers)
    const rateLimit = await consumeRateLimits([
      {
        name: 'register-ip',
        subject: ip,
        limit: 10,
        windowMs: 60 * 60 * 1000,
      },
    ])

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        },
      )
    }

    const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
    if (contentType !== 'application/json') {
      return NextResponse.json({ message: 'Envie os dados em formato JSON.' }, { status: 415 })
    }

    const data = await readJsonBody(request)
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ message: 'Dados invalidos.' }, { status: 400 })
    }

    const { username, email, password } = data as Record<string, unknown>
    const normalizedUsername = normalizeUsername(username)
    const normalizedEmail = normalizeEmail(email)
    if (!normalizedUsername || !normalizedEmail) {
      return NextResponse.json(
        { message: 'Informe um nome com 2 a 50 caracteres e um email valido.' },
        { status: 400 },
      )
    }

    if (!isValidRegistrationPassword(password)) {
      return NextResponse.json(
        { message: 'A senha deve ter pelo menos 8 caracteres e no maximo 72 bytes.' },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email ja esta cadastrado.' },
        { status: 409 },
      )
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        hashedPassword,
      },
      // Never return password hashes to the browser.
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    })

    return NextResponse.json(
      { user: newUser, message: 'Usuario cadastrado com sucesso.' },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { message: 'Os dados enviados excedem o tamanho permitido.' },
        { status: 413 },
      )
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Corpo da requisicao invalido.' }, { status: 400 })
    }

    const errorDetails = error && typeof error === 'object'
      ? error as { name?: unknown; code?: unknown; errorCode?: unknown }
      : {};
    const errorCode = typeof errorDetails.code === 'string'
      ? errorDetails.code
      : typeof errorDetails.errorCode === 'string'
        ? errorDetails.errorCode
        : undefined;

    // Log only error identifiers; Prisma messages can include connection details.
    console.error('[api/register] Cadastro falhou', {
      name: typeof errorDetails.name === 'string' ? errorDetails.name : 'UnknownError',
      code: errorCode,
    });

    if (errorCode === 'P2002') {
      return NextResponse.json(
        { message: 'Este email ja esta cadastrado.' },
        { status: 409 },
      )
    }

    if (errorCode && /^P10(00|01|02|03|08|10|11|13|17)$/.test(errorCode)) {
      return NextResponse.json(
        { message: 'Sem acesso ao banco de dados. Verifique DATABASE_URL, credenciais e acesso de rede ao MongoDB.' },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { message: 'Nao foi possivel concluir o cadastro.' },
      { status: 500 },
    )
  }
}
