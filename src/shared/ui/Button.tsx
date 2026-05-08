import styles from "./Button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantClass = variant === "primary" ? "" : styles[variant];

  return (
    <button
      className={`${styles.button} ${variantClass} ${className}`}
      {...props}
    />
  );
}
