import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../api.js";

// Wraps every admin route: no token in localStorage → bounce to /login.
export default function RequireAuth() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
