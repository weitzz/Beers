import PasswordRecoveryForm from "@/components/account/passwordRecoveryForm";

export const metadata = {
  title: "Recuperar senha | Cervejas",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return <PasswordRecoveryForm token={token} />;
}
