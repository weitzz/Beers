import Image from "next/image";
import login from "../../../public/login.jpg";
interface AccountLayoutProps {
  children: React.ReactNode;
}
const AccountLayout = ({ children }: AccountLayoutProps) => {
  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-5xl p-5 items-center">
        {children}

        <div className="md:block hidden w-1/2">
          <Image
            src={login}
            width={undefined}
            height={undefined}
            alt="imagem"
          />
        </div>
      </div>
    </main>
  );
};

export default AccountLayout;
