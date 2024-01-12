import { getRandomApi } from '@/services'
import { IBeer } from '@/types/beerTypes'
import React from 'react'
import Image from 'next/image'
import Notfound from 'public/beer.png'
import Link from 'next/link'
const RandomBeer = async () => {
    const getRandom: IBeer = await getRandomApi()
    return (
        <div className="flex items-center gap-3">
            <Link href={`/beer/${getRandom.id}`}>
                {getRandom.image_url ? (
                    <Image
                        src={getRandom.image_url}
                        alt={getRandom.name}
                        width={80}
                        height={100}
                        quality={100}
                        sizes="(max-width: 768px) 100vw,(max-width: 1200px) 4vw"
                        className="max-h-96"
                        priority
                    />

                ) : <Image
                    src={Notfound}
                    alt={getRandom.name}
                    width={80}
                    height={100}
                    quality={100}
                    priority
                />}

                <aside className="text-left">
                    <h2 className="font-bold text-xl mb-2 text-slate-700">{getRandom.name}</h2>
                    <p className="text-slate-600 text-base mt-2">{getRandom.tagline}</p>
                </aside>
            </Link>
        </div>
    )
}

export default RandomBeer