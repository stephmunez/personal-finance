import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Budgets from "./routes/Budgets";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Pots from "./routes/Pots";
import RecurringBills from "./routes/RecurringBills";
import Root from "./routes/root";
import SignUp from "./routes/SignUp";
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
      {
        path: "/pots",
        element: <Pots />,
      },
      {
        path: "/recurring-bills",
        element: <RecurringBills />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
