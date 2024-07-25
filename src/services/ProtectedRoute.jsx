import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.status === "blocked") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
