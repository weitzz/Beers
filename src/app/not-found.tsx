import Image from "next/image";
import Container from "@/components/container";
import LinkButton from "@/components/forms/linkButton";
import Notfound from "public/beer.png";
const NotFound = () => {
  return (
    <main className="text-center flex items-center justify-center flex-col p-4">
      <Image
        src={Notfound}
        alt=""
        width={100}
        height={100}
        quality={100}
        priority
      />
      <p className="text-3xl">Nao encontrado</p>
      <LinkButton href={"/beer"}>voltar</LinkButton>
    </main>
  );
};

export default NotFound;
