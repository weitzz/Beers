
import { NextResponse } from 'next/server'
import User from '@/models/user'
import { connectMongoDB } from '@/lib/mongodb';



export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const { email } = await request.json();
        const user = await User.findOne({ email }).select("_id");
        console.log("user: ", user);
        return NextResponse.json({ user });
    } catch (error) {
        console.log(error);
    }

}