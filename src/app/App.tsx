import { createBrowserRouter, RouterProvider } from "react-router";
import { TodosPage } from "../pages/todos/TodosPage";
import { AppLayout } from "../widgets/app-layout/ui/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [{ index: true, element: <TodosPage /> }],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
