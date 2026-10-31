import Image from "next/image";
import login from "../../../../public/login.jpg";

const ContainerAccount = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="ui-surface flex w-full max-w-5xl items-center overflow-hidden p-3 sm:p-5">
        {children}

        <div className="hidden w-1/2 overflow-hidden rounded-xl bg-slate-100 md:block">
          <Image
            src={login}
            width={640}
            height={720}
            alt="imagem"
            className="h-full max-h-[38rem] w-full object-cover"
          />
        </div>
      </div>
    </main>
  );
};

export default ContainerAccount;
