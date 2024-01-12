import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";


export const authOption = {
    providers: [
        GoogleProvider({
            name: 'credentialsGoogle',
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials) {
                const { email, password } = credentials
                try {
                    await connectMongoDB()
                    const user = await User.findOne({ email })
                    if (!user) { return null }
                    const passwordCheck = await bcrypt.compare(password, user.password)
                    if (!passwordCheck) {
                        return null
                    }
                    return user

                } catch (e) {
                    console.log("Error:", e)
                }


            }
        })

    ],
    pages: {
        signIn: '/'
    },
    session: {
        strategy: 'jwt'
    }, callbacks: {
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            session.user.id = token.id
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
}
const handler = NextAuth(authOption)


export { handler as GET, handler as POST }