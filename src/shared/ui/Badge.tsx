import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = {
  tone?: "green" | "yellow" | "gray" | "red";
  children: ReactNode;
};

export function Badge({ tone = "gray", children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
