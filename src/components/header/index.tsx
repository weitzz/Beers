import Image from "next/image";
import Link from "next/link";
import SignInButton from "../signInButton";
const Header = () => {
  return (
    <header className="h-16 w-full border-b border-slate-200 bg-white px-3 text-slate-700 shadow-sm sm:h-20 sm:px-4">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between gap-2">
        <nav className="flex shrink-0 items-center gap-3 text-xs font-semibold sm:gap-5 sm:text-sm">
          <Link className="flex h-11 w-11 shrink-0 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2" href="/" rel="preload" aria-label="Página inicial">
            <Image
              src="/beer.png"
              alt="Minhas cervejas"
              className="h-9 w-9 sm:h-10 sm:w-10"
              width={40}
              height={40}
              priority
            />
          </Link>
          <Link className="flex h-11 items-center whitespace-nowrap rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 hover:text-yellow-700" href="/beer" rel="preload">
            Cervejas
          </Link>
          <Link className="flex h-11 items-center whitespace-nowrap rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 hover:text-yellow-700" href="/profile" rel="preload">
            Perfil
          </Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};

export default Header;
