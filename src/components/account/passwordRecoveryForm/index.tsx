"use client";

import Button from "@/components/forms/button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import ContainerAccount from "../containerAccount";

type PasswordRecoveryFormProps = { token: string };

export default function PasswordRecoveryForm({ token }: PasswordRecoveryFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (token && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(token ? "/api/password/reset" : "/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { token, password } : { email }),
      });
      const result = await response.json() as { message?: string };

      if (!response.ok) {
        setError(result.message ?? "Não foi possível concluir a solicitação. Tente novamente.");
        return;
      }

      if (token) {
        setCompleted(true);
        window.history.replaceState({}, "", "/forgot-password");
        setMessage(result.message ?? "Senha redefinida com sucesso.");
      } else {
        setMessage(result.message ?? "Se houver uma conta com esse e-mail, enviaremos um link para redefinir a senha.");
      }
    } catch {
      setError("Não foi possível concluir a solicitação. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerAccount>
      <section className="w-full px-5 py-6 sm:px-8 md:w-1/2 md:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">Acesso à conta</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">
          {token ? (completed ? "Senha atualizada" : "Criar nova senha") : "Recuperar senha"}
        </h1>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        {message && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status" aria-live="polite">{message}</p>}

        {!token && (
          <>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Informe o e-mail da sua conta. Se encontrarmos um cadastro, enviaremos um link para criar uma nova senha.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="recovery-email">
                E-mail
                <input
                  id="recovery-email"
                  className="ui-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                />
              </label>
              <Button type="submit" className="mt-1 w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          </>
        )}

        {token && !completed && (
          <>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Escolha uma senha com pelo menos 8 caracteres. O link de recuperação expira após 30 minutos.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="new-password">
                Nova senha
                <input
                  id="new-password"
                  className="ui-input"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="confirm-password">
                Confirmar nova senha
                <input
                  id="confirm-password"
                  className="ui-input"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Digite a senha novamente"
                />
              </label>
              <Button type="submit" className="mt-1 w-full" disabled={loading}>
                {loading ? "Salvando..." : "Redefinir senha"}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-sm text-slate-600">
          <Link className="font-semibold text-yellow-700 hover:text-yellow-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" href="/login">
            Voltar para o login
          </Link>
        </p>
      </section>
    </ContainerAccount>
  );
}
