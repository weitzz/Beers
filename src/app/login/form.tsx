'use client';
import Button from '@/components/forms/button';
import Input from '@/components/forms/input';
import useForm from '@/hooks/useForm';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Form() {
    const email = useForm('email')
    const password = useForm()
    const router = useRouter();
    const [error, setError] = useState("");
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (await email.validate() && await password.validate()) {
                const formData = new FormData();
                formData.append('email', email.value);
                formData.append('password', password.value);
                const response = await signIn('credentials', {
                    email: email.value,
                    password: password.value,
                    redirect: false,
                });

                console.log({ response });

                if (response?.error) {
                    setError("Login inválido");
                    return;
                }
                router.replace("/beer");
            }
        } catch (e) {
            console.log(e)
        }


    };
    return (
        <>

            <form id='loginform' onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-lg mt-10">
                <Input label='Email' placeholder="email@email.com" type="text" name="email" {...email} />
                <Input label='Senha' placeholder="***" type="password" name="password" {...password} />
                <Button type="submit">Entrar</Button>
            </form>
            <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-yellow-300 after:ml-4 after:block after:h-px after:flex-grow after:bg-yellow-300'>
                ou
            </div>
            <div className='flex flex-col gap-2 mx-auto max-w-lg mt-10 '>

                <Button onClick={() => signIn('google')}>
                    Entrar com Google
                </Button>
                {error &&
                    <div className=" w-full bg-red-500 text-white  text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                    </div>
                }
                <p className='text-center text-sm text-gray-600 mt-2'>
                    Se você  não tem uma conta, por favor
                    <Link className='text-blue-500 hover:underline ml-2' href='/register'>
                        Registre-se
                    </Link>
                </p>
            </div>
        </>
    );
}