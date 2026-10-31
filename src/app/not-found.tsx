import Image from "next/image";

import LinkButton from "@/components/forms/linkButton";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-800 sm:text-5xl">
        Página não encontrada
      </h1>
      <Image src="/Barney.svg" alt="Ilustração de cerveja" width={300} height={100} priority />
      <LinkButton href="/beer">Voltar ao catálogo</LinkButton>
    </main>
  );
}
