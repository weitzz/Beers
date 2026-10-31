"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiUser } from "react-icons/fi";

import Button from "../forms/button";

const SignInButton = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button
        className="shrink-0 px-3 sm:px-4"
        onClick={() => signIn("google", { callbackUrl: "/beer" })}
      >
        Entrar
      </Button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
      <span className="hidden max-w-48 truncate text-sm text-slate-600 sm:inline">
        Olá, {session.user?.name || session.user?.email}
      </span>
      {session.user?.image ? (
        <Image
          src={session.user.image}
          width={36}
          height={36}
          quality={100}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-100 sm:h-9 sm:w-9"
          alt="Foto do perfil"
        />
      ) : (
        <FiUser className="text-slate-500" size={22} aria-hidden="true" />
      )}
      <Button
        className="px-3 sm:px-4"
        variant="secondary"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sair
      </Button>
    </div>
  );
};

export default SignInButton;
