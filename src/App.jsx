import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./features/login/Login";
import Register from "./features/Register/Register";
import UserManagement from "./features/management/UserManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./services/ProtectedRoute";
import Error from "./ui/Error";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/userManagement",
    element: (
      <ProtectedRoute>
        <UserManagement />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
  },
]);

function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={route} />
    </>
  );
}

export default App;
