'use client';

import Button from '@/components/forms/button';
import Input from '@/components/forms/input';
import useForm from '@/hooks/useForm';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Form() {
    const router = useRouter()
    const email = useForm('email')
    const password = useForm()
    const nome = useForm()
    const [error, setError] = useState("");
    const userExists = useForm();

    const checkUserExists = async (emailValue: string) => {
        try {
            const response = await fetch('/api/userExists', {
                method: 'POST',
                body: JSON.stringify({ email: emailValue }),
            });
            const { user } = await response.json();
            return user;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (await email.validate() && await password.validate() && await nome.validate()) {
            const formData = new FormData();
            formData.append('nome', nome.value);
            formData.append('email', email.value);
            formData.append('password', password.value);

            const userExistsResult = await checkUserExists(email.value);

            if (userExistsResult) {
                setError('Usuário já existe');
                return;
            }

            const requestBody = {
                nome: nome.value,
                email: email.value,
                password: password.value,
            };

            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(requestBody),
            };

            try {
                const response = await fetch(`/api/register`, requestOptions);
                router.push('/login');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    return (
        <>
            <form id='registerform'
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 mx-auto max-w-md mt-10"
            >
                <Input id={'nome'} label='Nome' placeholder="" type="text" name="nome"  {...nome} />
                <Input id={'email'} label='Email' placeholder="email@email.com" type="text" name="email"  {...email} />
                <Input id={'password'} label='Senha' placeholder="***" type="password" name="password"  {...password} />
                <Button type="submit">Registrar</Button>


                {userExists.error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                    {userExists.error}
                </div>}

            </form>
            <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-yellow-300 after:ml-4 after:block after:h-px after:flex-grow after:bg-yellow-300'>
                ou
            </div>
            <div className='flex flex-col gap-2 mx-auto max-w-lg mt-10 '>

                <Button onClick={() => signIn('google')}>
                    Entrar com Google
                </Button>
                <p className='text-center text-sm text-gray-600 mt-2'>
                    Se você tem uma conta, por favor
                    <Link className='text-blue-500 hover:underline ml-2' href='/login'>
                        Login
                    </Link>
                </p>
            </div>
        </>
    );
}