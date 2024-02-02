import Image from "next/image";

import LinkButton from "@/components/forms/linkButton";

import Barney from "public/Barney.svg";
const NotFound = () => {
  return (
    <main className=" mx-auto text-center flex items-center justify-center flex-col p-4 h-screen">
      <h2 className="text-5xl mb-3">Não Encontrado</h2>
      <Image
        src={Barney}
        alt="not-found"
        width={300}
        height={100}
        quality={100}
        priority
      />
      <LinkButton href={"/beer"}>voltar</LinkButton>
    </main>
  );
};

export default NotFound;
