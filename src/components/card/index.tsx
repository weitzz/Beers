"use client";
import React from "react";
import Image from "next/image";
import { IBeer } from "@/types/beerTypes";
import Link from "next/link";

interface CardProps {
  beers: any;
}

const Card = ({ beers }: CardProps) => {
  return (
    <>
      {beers.map((beer: any) => (
        <Link href={`/beer/${beer.id}`} key={beer.id}>
          <div className="max-w-sm  overflow-hidden shadow-lg bg-slate-100 rounded-md ">
            <div className="  flex justify-center p-2">
              <Image
                src={beer.image_url}
                alt={beer.name}
                width={60}
                height={62}
                quality={100}
                priority
              />
            </div>
            <div className="px-6 py-4 border-t border-yellow-300">
              <div className="font-bold text-xl mb-2">{beer.name}</div>
              <p className="text-slate-700 text-base">{beer.tagline}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Card;
