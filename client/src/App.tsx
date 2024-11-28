import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Budgets from "./routes/Budgets";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Pots from "./routes/Pots";
import RecurringBills from "./routes/RecurringBills";
import Root from "./routes/root";
import SignUp from "./routes/SignUp";
import Transactions from "./routes/Transactions";

const App = () => {
  const { user } = useAuthContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: user ? <Home /> : <Navigate to="/login" /> },
        {
          path: "/transactions",
          element: <Transactions />,
        },
        {
          path: "/budgets",
          element: user ? <Budgets /> : <Navigate to="login" />,
        },
        {
          path: "/pots",
          element: user ? <Pots /> : <Navigate to="login" />,
        },
        {
          path: "/recurring-bills",
          element: user ? <RecurringBills /> : <Navigate to="login" />,
        },
        {
          path: "/sign-up",
          element: !user ? <SignUp /> : <Home />,
        },
        {
          path: "/login",
          element: !user ? <Login /> : <Home />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
