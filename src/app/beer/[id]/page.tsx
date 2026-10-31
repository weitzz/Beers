import Image from "next/image";
import { notFound } from "next/navigation";

import Container from "@/components/container";
import LinkButton from "@/components/forms/linkButton";
import FavoriteButton from "@/components/profile/favoriteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getId } from "@/services";

const BeerDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const beers = await getId(id);
  const beer = beers[0];

  if (!beer) notFound();

  const session = await getServerSession(authOptions);
  const favorite = session?.user?.id
    ? await prisma.favorite.findUnique({
        where: {
          userId_beerId: { userId: session.user.id, beerId: beer.id },
        },
        select: { id: true },
      })
    : null;

  const ingredients = [
    ...(beer.ingredients?.malt?.map((item) => item.name) ?? []),
    ...(beer.ingredients?.hops?.map((item) => item.name) ?? []),
    ...(beer.ingredients?.yeast ? [beer.ingredients.yeast] : []),
  ];

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <article className="ui-surface mx-auto grid max-w-4xl items-center gap-8 p-5 sm:p-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:p-10">
          <div className="flex min-h-64 min-w-0 items-center justify-center rounded-2xl bg-yellow-50 p-6">
            <Image
              src={beer.image_url}
              alt={beer.name}
              width={220}
              height={320}
              quality={100}
              priority
              className="h-64 w-auto object-contain drop-shadow-lg"
            />
          </div>

          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">
              Detalhes da cerveja
            </p>
            <h1 className="break-words text-3xl font-bold text-slate-800 sm:text-4xl">
              {beer.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600">
              {beer.tagline}
            </p>
            <p className="mt-5 break-words text-sm leading-6 text-slate-600">
              {beer.description}
            </p>

            <div className="mt-6 flex gap-3">
              <div className="min-w-20 rounded-xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">ABV</p>
                <p className="font-bold text-slate-800">{beer.abv ?? "—"}%</p>
              </div>
              <div className="min-w-20 rounded-xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">IBU</p>
                <p className="font-bold text-slate-800">{beer.ibu ?? "—"}</p>
              </div>
            </div>

            {session?.user?.id && (
              <div className="mt-6 flex items-center gap-3">
                <FavoriteButton
                  beerId={beer.id}
                  initialFavorite={Boolean(favorite)}
                />
                <span className="text-sm font-medium text-slate-600">
                  {favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                </span>
              </div>
            )}

            {ingredients.length > 0 && (
              <section className="mt-7">
                <h2 className="text-base font-bold text-slate-800">Ingredientes</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <li
                      className="rounded-full bg-yellow-50 px-3 py-1 text-sm text-yellow-800"
                      key={`${ingredient}-${index}`}
                    >
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8">
              <LinkButton href="/beer">Voltar ao catálogo</LinkButton>
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
};

export default BeerDetails;
