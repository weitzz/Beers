import ContainerAccount from "@/components/account/containerAccount";

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  return <ContainerAccount>{children}</ContainerAccount>;
};

export default AccountLayout;
