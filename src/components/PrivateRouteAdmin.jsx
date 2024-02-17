// PrivateRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import SpinnerFull from "./SpinnerFull";

const PrivateRouteAdmin = () => {
  const { loggedIn, checkingStatus, isAdmin } = useAuthStatus();

  if (checkingStatus) {
    return <SpinnerFull />;
  }

  if (loggedIn && isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRouteAdmin;
