import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Provider } from "@/components/provider";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minhas cervejas",
  description: "Teste front end utilizando PunkAPI v2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
