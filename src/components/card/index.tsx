"use client";
import React from "react";
import Image from "next/image";

import Link from "next/link";

import { FaRegHeart } from "react-icons/fa";

interface CardProps {
  beers: any;
}
//bg-yellow-500 text-yellow-800
const Card = ({ beers }: CardProps) => {
  return (
    <>
      {beers.map((beer: any) => (
        <Link href={`/beer/${beer.id}`} key={beer.id}>
          <div className=" relative h-96 w-72 flex flex-col items-center justify-around shadow-md shadow-yellow-200 bg-yellow-500 rounded-md   px-6 pb-5">
            <Image
              className="absolute -top-5"
              src={beer.image_url}
              alt={beer.name}
              width={56}
              height={32}
              quality={100}
              priority
            />
            <div className=" pt-24 text-center mt-20 z-10">
              <h2 className="font-bold text-xl mb-2 text-slate-100">
                {beer.name}
              </h2>
              <div className="flex justify-center items-center gap-1 mb-4">
                <span className="text-slate-100 text-sm leading-[0.813rem]">
                  {beer.tagline}
                </span>
              </div>
              <div className="flex flex-row justify-center items-center text-slate-100">
                <div className="flex flex-col">
                  <p className="font-semibold">ABV</p>
                  <span>{beer.abv}</span>
                </div>
                <div className="border-slate-500 px-2 "></div>
                <div className="flex flex-col">
                  <p className="font-semibold">IBU</p>
                  <span> {beer.ibu}</span>
                </div>
              </div>
            </div>
            <button className="rounded-full w-10 h-10 bg-slate-100 absolute -bottom-2 flex justify-center items-center shadow-sm shadow-yellow-200">
              <FaRegHeart size={22} color="#f1c40f" />
            </button>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Card;
