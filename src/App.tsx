import { AppShell, MantineProvider } from "@mantine/core";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router";
import { ClientDetailsPage } from "./features/clients/ClientDetailsPage";
import { ClientsPage } from "./features/clients/ClientsPage";
import { theme } from "./theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ClientsPage /> },
      { path: "clients/:clientId", element: <ClientDetailsPage /> },
    ],
  },
]);

function Layout() {
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

export function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
