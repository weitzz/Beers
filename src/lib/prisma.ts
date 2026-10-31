import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  // A separate key avoids reusing an older PrismaClient cached by Next.js HMR,
  // before the Favorite model was added to the generated client.
  prismaWithFavorites?: PrismaClient;
};

const prisma =
  process.env.NODE_ENV === "production"
    ? new PrismaClient()
    : (globalForPrisma.prismaWithFavorites ??= new PrismaClient());

export default prisma;
