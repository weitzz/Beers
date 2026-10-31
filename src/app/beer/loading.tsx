import Container from "@/components/container";
import { Spinner } from "@/components/spinner";

export default function LoadingBeerPage() {
  return (
    <main className="w-full" aria-busy="true" aria-live="polite">
      <Container>
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 text-slate-600">
          <Spinner />
          <p>Carregando cervejas...</p>
        </div>
      </Container>
    </main>
  );
}
