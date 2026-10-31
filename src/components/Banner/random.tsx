import Image from "next/image";
import Link from "next/link";

import { getRandomApi } from "@/services";
import { IBeer } from "@/types/beerTypes";

const Banner = async () => {
  const beer: IBeer = await getRandomApi();

  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 py-8 text-white shadow-lg sm:px-10 md:py-10">
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-yellow-500/15 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-5 md:grid-cols-[1fr_0.8fr_1.3fr] md:gap-8">
        <div className="order-2 md:order-1">
          <p className="mb-3 inline-flex rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">
            Escolha do dia
          </p>
          <h2 className="break-words text-3xl font-black uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
            {beer.name}
          </h2>
          {beer.first_brewed && (
            <p className="mt-3 text-sm text-slate-300">
              No catálogo desde {beer.first_brewed}
            </p>
          )}
        </div>

        <div className="relative order-1 flex h-48 items-center justify-center md:order-2 md:h-64">
          <div
            aria-hidden="true"
            className="absolute h-40 w-40 rounded-full bg-yellow-400/15 blur-2xl md:h-52 md:w-52"
          />
          <Image
            src={beer.image_url || "/beer.png"}
            alt={beer.name}
            width={240}
            height={360}
            quality={100}
            sizes="(max-width: 768px) 160px, 220px"
            className="relative h-48 w-auto object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.55)] md:h-64"
            priority
          />
        </div>

        <div className="order-3 flex flex-col items-start gap-4">
          <p className="text-lg font-semibold text-yellow-100 sm:text-xl">
            {beer.tagline}
          </p>
          {beer.description && (
            <p className="line-clamp-3 text-sm leading-6 text-slate-300">
              {beer.description}
            </p>
          )}

          <div className="flex gap-3" aria-label="Informações da cerveja">
            <div className="min-w-20 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                ABV
              </p>
              <p className="font-bold text-white">{beer.abv ?? "—"}%</p>
            </div>
            <div className="min-w-20 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                IBU
              </p>
              <p className="font-bold text-white">{beer.ibu ?? "—"}</p>
            </div>
          </div>

          <Link
            href={`/beer/${beer.id}`}
            className="mt-1 inline-flex items-center rounded-full bg-yellow-400 px-5 py-2.5 font-bold text-slate-900 transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
