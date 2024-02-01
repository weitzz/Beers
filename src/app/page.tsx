import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import { redirect } from "next/navigation";
import Login from "@/components/account/formLogin";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/beer");
  }
  return <Login />;
}
