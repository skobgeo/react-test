import { Outlet } from "react-router";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={styles.appShell}>
      <header className={styles.appHeader}>
        <a className={styles.brandLink} href="/">
          Infinite Todos
        </a>
      </header>
      <main className={styles.appMain}>
        <Outlet />
      </main>
    </div>
  );
}
