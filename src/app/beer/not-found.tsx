import Link from "next/link";

export default function BeerNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-3xl font-bold text-slate-800">Cerveja não encontrada</p>
      <Link className="ui-button ui-button-primary" href="/beer">
        Voltar ao catálogo
      </Link>
    </main>
  );
}
