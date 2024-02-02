import Header from "@/components/header";

import Footer from "@/components/footer";

export default async function BeerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
