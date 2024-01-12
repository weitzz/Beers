import React from 'react'
import Image from 'next/image'
import { IBeer } from '@/types/beerTypes'

interface CardProps {
    item: IBeer
}

const Card = ({ item }: CardProps) => {
    return (
        <div key={item.id} className="max-w-sm  overflow-hidden shadow-lg bg-slate-100 rounded-md ">
            <div className='  flex justify-center p-2'>
                <Image src={item.image_url}
                    alt={item.name}
                    width={60}
                    height={62}
                    quality={100}
                    priority />
            </div>
            <div className="px-6 py-4 border-t border-yellow-300">
                <div className="font-bold text-xl mb-2">{item.name}</div>
                <p className="text-slate-700 text-base">
                    {item.tagline}
                </p>
            </div>
        </div>
    )
}

export default Card