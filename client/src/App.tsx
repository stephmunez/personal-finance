import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Budgets from "./routes/Budgets";
import Home from "./routes/Home";
import Root from "./routes/root";
import Transactions from "./routes/Transactions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/budgets",
        element: <Budgets />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
