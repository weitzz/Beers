import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Login from "@/components/account/formLogin";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/beer");

  return <Login />;
}
