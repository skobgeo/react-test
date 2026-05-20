import type { PropsWithChildren } from "react";

type FieldProps = PropsWithChildren<{
  error?: string;
  label: string;
}>;

export function Field({ children, error, label }: FieldProps) {
  return (
    <div className="field">
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </div>
  );
}
