"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/spinner";
import { fetchData } from "@/services";
import { IBeer } from "@/types/beerTypes";
import Card from "../card";
import Link from "next/link";

export function LoadMore() {
  const [beers, setBeers] = useState<IBeer[]>([]);
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadMoreBeers = async () => {
    // Once the page 8 is reached repeat the process all over again.
    await delay(2000);
    const nextPage = (page % 7) + 1;
    const newProducts = (await fetchData(nextPage)) ?? [];
    setBeers((prevProducts: IBeer[]) => [...prevProducts, ...newProducts]);
    setPage(nextPage);
  };

  useEffect(() => {
    if (inView) {
      loadMoreBeers();
    }
  }, [inView]);

  return (
    <>
      {beers.map((item) => (
        <Link href={`/beer/${item.id}`}>
          <Card item={item} key={item.id} />
        </Link>
      ))}
      <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
        ref={ref}
      >
        <Spinner />
      </div>
    </>
  );
}
