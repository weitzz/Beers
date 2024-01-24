import Header from "@/components/header";

import { AuthProvider } from "@/providers/authProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function BeerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Header />
      {children}
    </>
  );
}
