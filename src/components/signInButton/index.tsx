"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Button from "../forms/button";
import { FiUser } from "react-icons/fi";

const SignInButton = () => {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <div className="hidden sm:flex justify-center items-center gap-2">
          <span>Olá, {session?.user?.name || session?.user?.email}</span>
          {session.user?.image ? (
            <Image
              src={session?.user?.image}
              width={40}
              height={40}
              quality={100}
              className="rounded-full"
              alt="foto de perfil ou logotipo"
            />
          ) : (
            <FiUser size={25} />
          )}
          <Button onClick={() => signOut({ callbackUrl: "/" })}>Sair</Button>
        </div>
      ) : (
        <div className="hidden sm:flex justify-center items-center gap-2">
          <Button onClick={() => signIn("google")}>Entrar</Button>
        </div>
      )}
    </>
  );
};

export default SignInButton;
