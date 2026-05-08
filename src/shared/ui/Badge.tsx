import styles from "./Badge.module.css";

type BadgeProps = {
  tone: string;
  children: React.ReactNode;
};

export function Badge({ tone, children }: BadgeProps) {
  const toneClass = styles[tone] ?? styles.draft;

  return <span className={`${styles.badge} ${toneClass}`}>{children}</span>;
}
