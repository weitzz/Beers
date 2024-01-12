import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'
import User from '@/models/user'
import { connectMongoDB } from '@/lib/mongodb';



export async function POST(request: Request) {
    try {
        const { nome, email, password } = await request.json();
        const hashedPassword = await hash(password, 10);
        await connectMongoDB()
        await User.create({
            nome, email, password: hashedPassword
        })
    } catch (e) {
        console.log({ e });
    }

    return NextResponse.json({ message: 'success' });
}