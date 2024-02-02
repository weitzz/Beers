import Header from "@/components/header";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Footer from "@/components/footer";

export default async function BeerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/");
  }
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
