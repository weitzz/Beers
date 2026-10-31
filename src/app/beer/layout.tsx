import SiteLayout from "@/components/siteLayout";

export default async function BeerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}
