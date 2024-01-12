
import { IBeer } from '@/types/beerTypes';
import { getId } from '@/services'
import Container from '@/components/container';
import Image from 'next/image';
import LinkButton from '@/components/forms/linkButton';
interface PageProps {
    params: { id: string }
    searchParams: string
}


const BeerDetails = async ({ params }: PageProps) => {
    const beer = await getId(params.id)
    return (
        <main className='mt-4'>
            {beer && beer.map((item) => (
                <Container>
                    <div key={item.id}>
                        <div className='flex justify-center p-2'>
                            <Image src={item.image_url}
                                alt={item.name}
                                width={80}
                                height={75}
                                quality={100}
                                priority />
                        </div>
                        <div className="px-6 py-4">
                            <h2 className="font-bold text-xl mb-2 text-slate-700">{item.name}</h2>
                            <p className="text-slate-700 text-base">
                                {item.tagline}
                            </p>
                            <p className="text-slate-600 text-base mt-2">
                                {item.description}
                            </p>
                            <ul className="text-slate-600 text-base mt-2">
                                <h2 className="font-bold text-lg mb-2">Ingredientes:</h2>
                                <li>
                                    {item.ingredients?.malt?.name}
                                </li>
                                <li>{item.ingredients?.hops?.name}</li>
                                <li>{item.ingredients?.yeast}</li>
                            </ul>

                        </div>
                    </div>
                    <LinkButton href={'/beer'}>Voltar</LinkButton>
                </Container>
            ))
            }
        </main >

    )
}

export default BeerDetails