import { IBeer } from "@/@types/beer";
import Card from "@/components/card";
import Container from "@/components/container";
import InputSearch from "@/components/inputSearch";
import Banner from "@/components/Banner/random";
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
  console.log(beers);

  return (
    <main className="w-full">
      <Container>
        <section className=" bg-yellow-500 rounded-lg  mt-8">
          <Banner />
        </section>
        <InputSearch />
        <h1 className="text-center font-bold text-4xl mt-8 mb-8 text-slate-700">
          Cervejas
        </h1>
        <section className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Suspense key={query} fallback={<Spinner />}>
            {beer === undefined ? (
              <Card beers={beers} />
            ) : (
              <Card beers={beer} />
            )}
          </Suspense>
          {/* <LoadMore /> */}
        </section>
      </Container>
    </main>
  );
};

export default Beer;
