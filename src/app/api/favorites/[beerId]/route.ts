import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ beerId: string }>;
}

const getFavoriteContext = async (beerIdParam: string) => {
  const session = await getServerSession(authOptions);
  const beerId = Number(beerIdParam);

  if (!session?.user?.id) {
    return { response: NextResponse.json({ message: "Entre na sua conta." }, { status: 401 }) };
  }
  if (!Number.isSafeInteger(beerId) || beerId <= 0) {
    return { response: NextResponse.json({ message: "Cerveja invalida." }, { status: 400 }) };
  }

  return { userId: session.user.id, beerId };
};

export async function PUT(_request: Request, { params }: RouteContext) {
  const { beerId } = await params;
  const context = await getFavoriteContext(beerId);
  if ("response" in context) return context.response;

  try {
    await prisma.favorite.upsert({
      where: {
        userId_beerId: { userId: context.userId, beerId: context.beerId },
      },
      create: { userId: context.userId, beerId: context.beerId },
      update: {},
    });

    return NextResponse.json({ favorite: true });
  } catch (error) {
    const details = error && typeof error === "object"
      ? error as { name?: unknown; code?: unknown }
      : {};
    console.error("[api/favorites] Falha ao salvar favorito", {
      name: typeof details.name === "string" ? details.name : "UnknownError",
      code: typeof details.code === "string" ? details.code : undefined,
    });
    return NextResponse.json(
      { message: "Nao foi possivel salvar esta cerveja agora." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { beerId } = await params;
  const context = await getFavoriteContext(beerId);
  if ("response" in context) return context.response;

  try {
    await prisma.favorite.deleteMany({
      where: { userId: context.userId, beerId: context.beerId },
    });
    return NextResponse.json({ favorite: false });
  } catch (error) {
    const details = error && typeof error === "object"
      ? error as { name?: unknown; code?: unknown }
      : {};
    console.error("[api/favorites] Falha ao remover favorito", {
      name: typeof details.name === "string" ? details.name : "UnknownError",
      code: typeof details.code === "string" ? details.code : undefined,
    });
    return NextResponse.json(
      { message: "Nao foi possivel remover esta cerveja agora." },
      { status: 500 },
    );
  }
}
