import type { InputHTMLAttributes } from "react";
import styles from "./Field.module.css";

type NumberFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function NumberField({
  label,
  error,
  className = "",
  ...props
}: NumberFieldProps) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} type="number" {...props} />
      <span className={styles.error}>{error}</span>
    </label>
  );
}
