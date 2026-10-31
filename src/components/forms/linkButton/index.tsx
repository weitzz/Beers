import Link from "next/link";

interface LinkButtonProps {
  children: string;
  href: string;
}

const LinkButton = ({ children, href }: LinkButtonProps) => {
  return (
    <Link href={href} className="ui-button ui-button-primary">
      {children}
    </Link>
  );
};

export default LinkButton;
