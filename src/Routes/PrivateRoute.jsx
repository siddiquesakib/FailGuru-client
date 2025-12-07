import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) return children;
  return <Navigate to="/auth/login" state={location.pathname} replace="true" />;
};

export default PrivateRoute;
