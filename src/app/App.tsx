import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ClientDetailsPage } from "../pages/client-details/ClientDetailsPage";
import { ClientsPage } from "../pages/clients/ClientsPage";
import { AppLayout } from "../widgets/app-layout/ui/AppLayout";
import { theme } from "./theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <ClientsPage /> },
      { path: "clients/:clientId", element: <ClientDetailsPage /> },
    ],
  },
]);

export function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
