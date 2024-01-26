import { IBeer } from "@/@types/beer";
import Card from "@/components/card";
import Container from "@/components/container";
import InputSearch from "@/components/inputSearch";
import ListBeer from "@/components/listBeer";
import { LoadMore } from "@/components/paginationControls";
import RandomBeer from "@/components/randomBeer";
import { Spinner } from "@/components/spinner";
import { getAll, getDataName } from "@/services";
import React, { Suspense } from "react";
const Beer = async ({
  searchParams,
}: {
  searchParams?: { query?: string };
}) => {
  const query = searchParams?.query || "";
  const beers: any = await getAll();
  const beer = await getDataName(query);

  return (
    <main className="w-full">
      <Container>
        <h1 className="text-center font-bold text-xl mt-8 mb-8 text-slate-700">
          Cerveja do dia
        </h1>
        <section className="w-full bg-slate-100 rounded-lg flex justify-around py-3 ">
          <RandomBeer />
        </section>
        <InputSearch />
        <h1 className="text-center font-bold text-xl mt-8 mb-8 text-slate-700">
          Cervejas
        </h1>
        <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Suspense key={query} fallback={<Spinner />}>
            {beer === undefined ? (
              <Card beers={beers} />
            ) : (
              <Card beers={beer} />
            )}
          </Suspense>
          <LoadMore />
        </section>
      </Container>
    </main>
  );
};

export default Beer;
