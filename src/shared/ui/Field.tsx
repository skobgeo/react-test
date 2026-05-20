import type { PropsWithChildren } from "react";
import styles from "./Field.module.css";

type FieldProps = PropsWithChildren<{
  error?: string;
  label: string;
}>;

export function Field({ children, error, label }: FieldProps) {
  return (
    <div className={styles.field}>
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </div>
  );
}
