import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Cualquier usuario autenticado */
export default function PrivateRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Solo administrador → redirige a /login si no lo es */
export function AdminRoute() {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.tipo !== "administrador") return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Solo encargado */
export function EncargadoRoute() {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.tipo !== "encargado") return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Solo empleado */
export function EmpleadoRoute() {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.tipo !== "empleado") return <Navigate to="/login" replace />;
  return <Outlet />;
}
