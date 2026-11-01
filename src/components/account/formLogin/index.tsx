"use client";
import Button from "@/components/forms/button";
import ButtonGoogle from "@/components/forms/buttonGoogle";
import Input from "@/components/forms/input";
import useForm from "@/hooks/useForm";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ContainerAccount from "../containerAccount";

const Login = () => {
  const email = useForm("email");
  const password = useForm();
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if ((await email.validate()) && (await password.validate())) {
        const response = await signIn("credentials", {
          email: email.value,
          password: password.value,
          redirect: false,
        });

        if (!response?.ok) {
          setError(
            response?.error === "CredentialsSignin"
              ? "Email ou senha invalidos."
              : "Nao foi possivel consultar o banco de dados. Verifique a conexao com o MongoDB.",
          );
          return;
        }
        router.replace("/beer");
      } else {
        setError("Confira o email e a senha informados.");
      }
    } catch (e) {
      setError("Nao foi possivel entrar. Tente novamente.");
    }
  };
  return (
    <ContainerAccount>
      <section className="w-full px-5 py-6 sm:px-8 md:w-1/2 md:px-12">
        <h2 className="text-3xl font-bold text-slate-800">Entrar</h2>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <p className="mt-3 text-sm text-slate-500">
          Acesse sua conta para explorar o catalogo de cervejas.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Input
            className="mt-2"
            type="email"
            name="email"
            placeholder="seu@email.com"
            {...email}
          />
          <div className="relative">
            <Input
              className="pr-10"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Senha"
              {...password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              className="absolute right-1 top-[21px] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {showPassword ? (
                  <path d="M3.27 2 2 3.27l3.2 3.2C3.1 8.1 1.6 10.1 1 12c1.7 4.4 6 7.5 11 7.5 1.7 0 3.3-.4 4.7-1.1L20.7 22 22 20.7 3.27 2ZM12 17.5c-3.6 0-6.7-2.1-8.2-5.5.6-1.4 1.6-2.7 2.8-3.6l2 2a3.5 3.5 0 0 0 4.9 4.9l2 2c-1.1.2-2.3.2-3.5.2ZM12 4.5c-1.7 0-3.3.4-4.7 1.1l2 2A3.5 3.5 0 0 1 15.4 14l2 2c1.6-1.1 2.9-2.5 3.6-4-1.7-4.4-6-7.5-11-7.5Z" />
                ) : (
                  <path d="M12 4.5c-5 0-9.3 3.1-11 7.5 1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                )}
              </svg>
            </button>
          </div>
          <Button type="submit" className="mt-1 w-full">
            Entrar
          </Button>
        </form>

        <div className="mt-6 grid grid-cols-3 items-center text-slate-400">
          <hr className="border-slate-200" />
          <p className="text-center text-xs font-semibold uppercase tracking-wide">ou</p>
          <hr className="border-slate-200" />
        </div>

        <ButtonGoogle />

        <div className="mt-5 border-b border-slate-200 py-3 text-sm text-slate-500">
          <Link className="font-medium text-yellow-700 hover:text-yellow-800" href="/forgot-password">Esqueceu a senha?</Link>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-slate-500">
            Ainda nao tem conta?
            <Link
              className="ml-2 font-semibold text-yellow-700 hover:text-yellow-800"
              href="/register"
            >
              Registre-se
            </Link>
          </p>
        </div>
      </section>
    </ContainerAccount>
  );
};
export default Login;
