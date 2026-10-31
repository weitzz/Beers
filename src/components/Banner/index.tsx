import { getRandomApi } from "@/services";
import { IBeer } from "@/types/beerTypes";
import React from "react";
import Image from "next/image";
import Link from "next/link";
const RandomBeer = async () => {
  const getRandom: IBeer = await getRandomApi();
  return (
    <div className="flex min-h-80 items-center justify-center py-8">
      <Link className="ui-surface flex w-full max-w-sm flex-col items-center p-6 text-center hover:border-yellow-300 hover:shadow-md" href={`/beer/${getRandom.id}`}>
        {getRandom.image_url ? (
          <Image
            src={getRandom.image_url}
            alt={getRandom.name}
            width={80}
            height={100}
            quality={100}
            sizes="(max-width: 768px) 100vw,(max-width: 1200px) 4vw"
            className="h-48 w-auto object-contain"
            priority
          />
        ) : (
          <Image
            src="/beer.png"
            alt={getRandom.name}
            width={80}
            height={100}
            quality={100}
            priority
          />
        )}

        <aside>
          <h2 className="mb-2 text-lg font-bold text-slate-800">
            {getRandom.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{getRandom.tagline}</p>
        </aside>
      </Link>
    </div>
  );
};

export default RandomBeer;
