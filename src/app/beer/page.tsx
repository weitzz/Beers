import Card from "@/components/card";
import Container from "@/components/container";
import InputSearch from "@/components/inputSearch";
import { getServerSession } from "next-auth";
import Banner from "@/components/Banner/random";
import { Spinner } from "@/components/spinner";
import { getAll } from "@/services";
import React, { Suspense } from "react";
import PaginationControls from "@/components/paginationControls";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
const Beer = async ({
  searchParams,
}: {
  searchParams: { query: string | undefined; page: string; per_page: string };
}) => {
  const query = searchParams?.query || "";
  const page = searchParams.page ?? "1";
  const per_page = searchParams.per_page ?? "6";
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const beers: any = await getAll();
  const filteredBeers = beers.filter((beer: any) => {
    return beer.name.toLowerCase().includes(query?.toLowerCase());
  });
  const beersPaginations = beers.slice(start, end);

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/");
  }

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
            <Card
              beers={
                filteredBeers === undefined ? beersPaginations : filteredBeers
              }
            />
          </Suspense>
        </section>
        <PaginationControls
          hasNextPage={end < beers.length}
          hasPrevPage={start > 0}
        />
      </Container>
    </main>
  );
};

export default Beer;
