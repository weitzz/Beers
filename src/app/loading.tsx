import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm font-medium text-slate-500" aria-live="polite">
        <Spinner />
        Carregando...
      </div>
    </main>
  );
}
