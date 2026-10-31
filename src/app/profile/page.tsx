import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiHeart, FiMail, FiUser } from "react-icons/fi";

import Card from "@/components/card";
import Container from "@/components/container";
import ProfileSignOutButton from "@/components/profile/signOutButton";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getByIds } from "@/services";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const name = session.user.name?.trim() || "Usu\u00e1rio";
  const email = session.user.email || "Email n\u00e3o informado";
  const initials = name === "Usu\u00e1rio"
    ? "U"
    : name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { beerId: true },
    orderBy: { createdAt: "desc" },
  });
  const favoriteIds = favorites.map((favorite) => favorite.beerId);
  const favoriteBeers = await getByIds(favoriteIds);

  return (
    <main className="min-h-[70vh] py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">
              Sua conta
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
              Meu perfil
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {"Consulte suas informa\u00e7\u00f5es de acesso."}
            </p>
          </header>

          <section className="ui-surface overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-yellow-600 sm:h-32" />
            <div className="px-5 pb-6 sm:px-8 sm:pb-8">
              <div className="-mt-12 mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-yellow-100 text-2xl font-bold text-yellow-800 shadow-md sm:-mt-14 sm:h-28 sm:w-28">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={`Foto de ${name}`}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    priority
                  />
                ) : (
                  initials
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-800">{name}</h2>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500">
                <FiMail aria-hidden="true" />
                {email}
              </p>

              <div className="mt-7 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                <ProfileDetail icon={<FiUser aria-hidden="true" />} label="Nome">
                  {name}
                </ProfileDetail>
                <ProfileDetail icon={<FiMail aria-hidden="true" />} label="Email">
                  {email}
                </ProfileDetail>
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                <Link className="ui-button ui-button-primary" href="/beer">
                  Explorar cervejas
                </Link>
                <ProfileSignOutButton />
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-800">
                Minhas cervejas favoritas
              </h2>
              <span className="text-sm text-slate-500">{favoriteBeers.length}</span>
            </div>
            {favoriteBeers.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card beers={favoriteBeers} favoriteIds={favoriteIds} />
              </div>
            ) : (
              <div className="ui-surface flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-800">
                  <FiHeart aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-slate-700">Sua lista esta vazia</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Favorite cervejas no catalogo para encontra-las aqui.
                  </p>
                </div>
                <Link className="ui-button ui-button-primary sm:ml-auto" href="/beer">
                  Explorar catalogo
                </Link>
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}

function ProfileDetail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-800">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-all text-sm font-medium text-slate-700">
          {children}
        </p>
      </div>
    </div>
  );
}
