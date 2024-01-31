
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import prismaClient from "./prisma";
import prisma from './prisma';
import bcrypt from 'bcrypt';


export const authOptions:AuthOptions = {
    adapter: PrismaAdapter(prismaClient),
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
           CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      authorize: async (
        credentials: any
        
      ): Promise<any> => {
         if(!credentials?.email || !credentials?.password) throw new Error("Dados de Login necessarios")

          const user = await prisma.user.findFirst({
              where: {
                  email: credentials.email
              }
          })

           if(!user || !user.hashedPassword) {
                    throw new Error("Usuários não registrado através de credenciais")
        }
        
            const matchPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
                if(!matchPassword)
                    throw new Error("Senha incorreta")
                return user
      },
    }),
  ],
  session: {
     strategy: 'jwt'
   },
     
pages: {
  signIn: '/login',
  newUser: '/register'
  },

}


