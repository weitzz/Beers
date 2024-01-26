import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma';


export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { username, email, password } = data
        const hashedPassword = await hash(password, 10);

         if(!username || !email || !password){
        return NextResponse.json("Dados inválidos.", { status: 400})
    }
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        if (existingUser) {
            return NextResponse.json({user: null, message: 'Email já cadastrado' },{status: 409});
        }

         

       const newUser =  await prisma.user.create({
            data: {
                username, email, hashedPassword
            }
       })
       
        
        return NextResponse.json({user: newUser,message: "Usuário cadastrado com sucesso"},{status: 201})
    } catch (e) {
        return NextResponse.json({message: "Algo deu errado"},{status: 500})
    }

}