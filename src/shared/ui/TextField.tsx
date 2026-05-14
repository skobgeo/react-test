import type { InputHTMLAttributes } from "react";
import styles from "./Field.module.css";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({
  label,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} {...props} />
      <span className={styles.error}>{error}</span>
    </label>
  );
}
