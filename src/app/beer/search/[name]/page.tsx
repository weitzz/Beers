import Card from '@/components/card'
import Container from '@/components/container'
import InputSearch from '@/components/inputSearch'
import { getDataName } from '@/services'
import Link from 'next/link'





const SearchBeer = async ({ params: { name } }: { params: { name: string } }) => {
    const beerName = await getDataName(name)
    return (
        <Container>
            <InputSearch />
            <h2 className="font-bold text-xl mb-2 text-slate-700">Cervejas encontradas:</h2>
            <main className='grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {!beerName && (
                    <p>Cerveja não encontrada</p>

                )}
                {beerName && beerName.map((item) => (
                    <Link href={`/beer/${item.id}`}>
                        <Card item={item} key={item.id} />
                    </Link>

                )
                )}

            </main>
        </Container>
    )
}

export default SearchBeer