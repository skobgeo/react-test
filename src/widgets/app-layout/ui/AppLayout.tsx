import { AppShell } from "@mantine/core";
import { Link, Outlet } from "react-router";

export function AppLayout() {
  return (
    <AppShell header={{ height: 58 }} padding="md">
      <AppShell.Header className="appHeader">
        <Link to="/" className="brandLink">
          Client Directory
        </Link>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
