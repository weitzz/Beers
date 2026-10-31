import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import Banner from "@/components/Banner/random";
import Card from "@/components/card";
import Container from "@/components/container";
import BeerFilters from "@/components/beerFilters";
import InputSearch from "@/components/inputSearch";
import PaginationControls from "@/components/paginationControls";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAll, getDataName } from "@/services";
import { IBeer } from "@/types/beerTypes";

const Beer = async ({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
    per_page?: string;
    abv?: string;
    ibu?: string;
    favorites?: string;
    sort?: string;
  }>;
}) => {
  const filters = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const query = filters.query?.trim() || "";
  const beers: IBeer[] = query ? [] : await getAll();
  const searchResults = query ? await getDataName(query) : null;
  const resultList = searchResults ?? beers;
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { beerId: true },
  });
  const favoriteIds = favorites.map((favorite) => favorite.beerId);

  let filteredBeers = resultList.filter((beer) => {
    if (filters.favorites === "1" && !favoriteIds.includes(beer.id)) return false;

    const abv = Number(beer.abv);
    if (filters.abv === "low" && (!Number.isFinite(abv) || abv > 5)) return false;
    if (filters.abv === "medium" && (!Number.isFinite(abv) || abv <= 5 || abv > 8)) return false;
    if (filters.abv === "high" && (!Number.isFinite(abv) || abv <= 8)) return false;

    const ibu = Number(beer.ibu);
    if (filters.ibu === "low" && (!Number.isFinite(ibu) || ibu > 20)) return false;
    if (filters.ibu === "medium" && (!Number.isFinite(ibu) || ibu <= 20 || ibu > 50)) return false;
    if (filters.ibu === "high" && (!Number.isFinite(ibu) || ibu <= 50)) return false;

    return true;
  });

  switch (filters.sort) {
    case "name":
      filteredBeers = [...filteredBeers].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      break;
    case "abv_asc":
      filteredBeers = [...filteredBeers].sort((a, b) => (a.abv ?? 0) - (b.abv ?? 0));
      break;
    case "abv_desc":
      filteredBeers = [...filteredBeers].sort((a, b) => (b.abv ?? 0) - (a.abv ?? 0));
      break;
    case "ibu_asc":
      filteredBeers = [...filteredBeers].sort((a, b) => (a.ibu ?? 0) - (b.ibu ?? 0));
      break;
    case "ibu_desc":
      filteredBeers = [...filteredBeers].sort((a, b) => (b.ibu ?? 0) - (a.ibu ?? 0));
      break;
  }

  const pageValue = Number(filters.page ?? "1");
  const perPageValue = Number(filters.per_page ?? "8");
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const perPage = Number.isSafeInteger(perPageValue) && perPageValue > 0 ? perPageValue : 8;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const displayedBeers = filteredBeers.slice(start, end);

  return (
    <main className="w-full">
      <Container>
        <section className="mt-6">
          <Banner />
        </section>
        <InputSearch />
        <BeerFilters />
        <h1 className="mb-6 mt-10 text-center text-3xl font-bold text-slate-800 sm:text-4xl">
          Cervejas <span className="text-lg font-medium text-slate-500">({filteredBeers.length})</span>
        </h1>
        <section className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Card beers={displayedBeers} favoriteIds={favoriteIds} />
        </section>
        {filteredBeers.length === 0 ? (
          <p className="break-words py-10 text-center text-slate-600" role="status">
            {query && resultList.length === 0
              ? `Nenhuma cerveja encontrada para "${query}".`
              : "Nenhuma cerveja corresponde aos filtros selecionados."}
          </p>
        ) : (
          <PaginationControls
            hasNextPage={end < filteredBeers.length}
            hasPrevPage={start > 0}
            totalPages={Math.ceil(filteredBeers.length / perPage)}
          />
        )}
      </Container>
    </main>
  );
};

export default Beer;
