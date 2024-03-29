interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  children,
  onClick,
  className,

  ...props
}: IButtonProps) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`${className} "text-base cursor-pointer border-0 rounded-md bg-yellow-500 text-yellow-800 px-3 py-2 "`}
    >
      {children}
    </button>
  );
};

export default Button;
