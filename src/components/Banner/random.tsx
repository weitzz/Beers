import { getRandomApi } from "@/services";
import React from "react";
import Image from "next/image";
import Notfound from "public/beer.png";
import Link from "next/link";
const Banner = async () => {
  const getRandom: any = await getRandomApi();
  console.log(getRandom);
  return (
    <div className="min-h-[550px] flex justify-center items-center py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-white rounded-3xl">
          {/* first col */}
          <div className="p-6 sm:p-8">
            <p data-aos="slide-right" className="font-bold text-xl">
              Cerveja do dia
            </p>
            <h1
              data-aos="zoom-out"
              className="uppercase text-4xl lg:text-7xl font-bold"
            >
              {getRandom.name}
            </h1>
          </div>
          {/* second col */}
          <div data-aos="zoom-in" className="h-full flex items-center">
            {getRandom.image_url ? (
              <Image
                src={getRandom.image_url}
                alt={getRandom.name}
                width={120}
                height={100}
                quality={100}
                className="   mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,.6)]"
                priority
              />
            ) : (
              <Image
                src={Notfound}
                alt={getRandom.name}
                width={150}
                height={100}
                quality={100}
                priority
                className=" mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,.6)] "
              />
            )}
          </div>
          {/* third col */}
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <p data-aos="zoom-out" className="font-bold text-xl">
              {getRandom.first_brewed}
            </p>
            <p data-aos="fade-up" className=" text-3xl sm:text-5xl font-bold">
              {getRandom.tagline}
            </p>
            <p data-aos="fade-up" className="text-sm tracking-wide leading-5">
              {getRandom.description}
            </p>
            <div data-aos="fade-up" data-aos-offset="0">
              <Link
                href={`/beer/${getRandom.id}`}
                className="bg-white py-2 px-4 rounded-full text-yellow-600"
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
