import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Budgets from "./routes/Budgets";
import Home from "./routes/Home";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import Pots from "./routes/Pots";
import RecurringBills from "./routes/RecurringBills";
import Root from "./routes/root";
import SignUp from "./routes/SignUp";
import Transactions from "./routes/Transactions";

const App = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or placeholder if needed
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: user ? <Home /> : <Navigate to="/login" /> },
        {
          path: "/transactions",
          element: user ? <Transactions /> : <Navigate to="/login" />,
        },
        {
          path: "/budgets",
          element: user ? <Budgets /> : <Navigate to="/login" />,
        },
        {
          path: "/pots",
          element: user ? <Pots /> : <Navigate to="/login" />,
        },
        {
          path: "/recurring-bills",
          element: user ? <RecurringBills /> : <Navigate to="/login" />,
        },
        {
          path: "/sign-up",
          element: !user ? <SignUp /> : <Navigate to="/" />,
        },
        {
          path: "/login",
          element: !user ? <Login /> : <Navigate to="/" />,
        },
        {
          path: "/404",
          element: <NotFound />,
        },
        {
          path: "*",
          element: <Navigate to="/404" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
