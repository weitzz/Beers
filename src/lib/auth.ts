import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

import { isValidLoginPassword, normalizeEmail } from "./inputValidation";
import { consumeRateLimits, getClientIp } from "./rateLimit";
import prisma from "./prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(
    prisma as unknown as Parameters<typeof PrismaAdapter>[0],
  ),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = normalizeEmail(credentials?.email);
        const password = credentials?.password;
        if (!email || !isValidLoginPassword(password)) return null;

        try {
          const ip = getClientIp(request?.headers ?? {});
          const rateLimit = await consumeRateLimits([
            {
              name: "login-ip",
              subject: ip,
              limit: 30,
              windowMs: 15 * 60 * 1000,
            },
            {
              name: "login-ip-email",
              subject: `${ip}:${email}`,
              limit: 10,
              windowMs: 15 * 60 * 1000,
            },
          ]);

          if (!rateLimit.allowed) {
            console.info("[auth] Tentativas de login limitadas");
            return null;
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.info("[auth] Login rejeitado", { reason: "user_not_found" });
            return null;
          }
          if (!user.hashedPassword) {
            console.info("[auth] Login rejeitado", { reason: "password_not_configured" });
            return null;
          }

          const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
          if (!passwordMatches) {
            console.info("[auth] Login rejeitado", { reason: "password_mismatch" });
            return null;
          }

          return {
            id: user.id,
            name: user.username ?? user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          const details = error && typeof error === "object"
            ? error as { name?: unknown; code?: unknown }
            : {};
          console.error("[auth] Falha ao consultar login", {
            name: typeof details.name === "string" ? details.name : "UnknownError",
            code: typeof details.code === "string" ? details.code : undefined,
          });
          throw new Error("Authentication service unavailable");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
