
import Image from 'next/image'
import Beer from 'public/beer.png'
import Link from 'next/link'
import SignInButton from '../signInButton'
const Header = () => {
    return (
        <header className='w-full h-16 sm:h-28 bg-slate-100 text-slate-500 px-2 border border-yellow-300 '>
            <div className='max-w-screen-xl mx-auto flex justify-center items-center h-28 sm:justify-between'>
                <nav className='flex justify-center items-center gap-4'>
                    <Link href='/' rel="preload">
                        <Image src={Beer} alt='logo-cerveja' width={50} height={50} priority />
                    </Link>
                    <Link href='/beer' rel="preload">
                        Cervejas
                    </Link>
                    <Link href='/profile' rel="preload">
                        Perfil
                    </Link>
                </nav>
                <SignInButton />
            </div>
        </header>
    )
}

export default Header