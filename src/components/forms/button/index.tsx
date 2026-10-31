interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: IButtonProps) => {
  return (
    <button
      {...props}
      className={`ui-button ${variant === "primary" ? "ui-button-primary" : "ui-button-secondary"} ${className ?? ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
