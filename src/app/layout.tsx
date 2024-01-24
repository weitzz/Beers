import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { AuthProvider } from "@/providers/authProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minhas cervejas",
  description: "Teste front end utilizando PunkAPI v2",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="pt-BR">
      <body className={rubik.className}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
