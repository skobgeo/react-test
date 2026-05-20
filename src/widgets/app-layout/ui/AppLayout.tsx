import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <div className="appShell">
      <header className="appHeader">
        <a className="brandLink" href="/">
          Infinite Todos
        </a>
      </header>
      <main className="appMain">
        <Outlet />
      </main>
    </div>
  );
}
