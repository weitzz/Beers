
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prismaClient from "@/lib/prisma";
import { authenticateService } from "@/services/authenticateService";
import { authOptions } from "@/lib/auth";


const handler = NextAuth(authOptions)


export { handler as GET, handler as POST, authOptions };


