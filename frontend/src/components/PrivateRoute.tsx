// src/components/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, message: "You must be logged in to access this page." }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
