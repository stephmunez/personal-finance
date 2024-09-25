import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './routes/Home';
import Root from './routes/root';
import Transactions from './routes/Transactions';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      {
        path: '/transactions',
        element: <Transactions />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
