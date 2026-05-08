import { createBrowserRouter, RouterProvider } from "react-router";
import { ShipmentDetailsPage } from "../pages/shipment-details/ShipmentDetailsPage";
import { ShipmentsPage } from "../pages/shipments/ShipmentsPage";
import { AppLayout } from "../widgets/app-layout/ui/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <ShipmentsPage /> },
      { path: "shipments/:shipmentId", element: <ShipmentDetailsPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
