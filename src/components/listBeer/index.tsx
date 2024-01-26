import { IBeer } from "@/types/beerTypes";
import Link from "next/link";
import { getAll, getDataName } from "@/services";
import Card from "../card";
import { LoadMore } from "../paginationControls";
import { Suspense } from "react";
import { Spinner } from "../spinner";

const ListBeer = async () => {
  return (
    <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      /*aqui faz o search*/
      <LoadMore />
    </section>
  );
};

export default ListBeer;
