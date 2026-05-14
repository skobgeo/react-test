import type { TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextArea({
  label,
  error,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span className={styles.label}>{label}</span>
      <textarea className={styles.textarea} {...props} />
      <span className={styles.error}>{error}</span>
    </label>
  );
}
