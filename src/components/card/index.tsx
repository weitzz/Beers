import Image from "next/image";
import Link from "next/link";

import FavoriteButton from "@/components/profile/favoriteButton";
import { IBeer } from "@/types/beerTypes";

interface CardProps {
  beers: IBeer[];
  favoriteIds?: number[];
}

const Card = ({ beers, favoriteIds = [] }: CardProps) => {
  return (
    <>
      {beers.map((beer) => (
        <div className="group relative h-full min-w-0" key={beer.id}>
          <Link className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2" href={`/beer/${beer.id}`}>
            <article className="flex h-full min-h-[24rem] min-w-0 flex-col items-center justify-between rounded-2xl border border-yellow-200 bg-white px-5 pb-16 pt-6 shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:border-yellow-400 group-hover:shadow-lg group-hover:shadow-yellow-100">
              <Image
                className="h-40 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                src={beer.image_url}
                alt={beer.name}
                width={120}
                height={180}
                quality={100}
                sizes="120px"
              />
              <div className="z-10 flex flex-1 flex-col items-center justify-center pt-3 text-center">
                <h2 className="mb-2 break-words text-lg font-bold text-slate-800">
                  {beer.name}
                </h2>
                <div className="mb-4 flex items-center justify-center gap-1">
                  <span className="line-clamp-2 break-words text-sm leading-5 text-slate-500">
                    {beer.tagline}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center gap-8 text-slate-600">
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      ABV
                    </p>
                    <span className="font-semibold text-slate-800">
                      {beer.abv ?? "—"}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      IBU
                    </p>
                    <span className="font-semibold text-slate-800">
                      {beer.ibu ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
          <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
            <FavoriteButton
              beerId={beer.id}
              initialFavorite={favoriteIds.includes(beer.id)}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;
