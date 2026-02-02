import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../types/auth.types";
import { getAuth } from "../store/auth.store";
import type { JSX } from "react";

interface Props {
  role?: Role;
  children?: JSX.Element;
}

export default function ProtectedRoute({ role, children }: Props) {
  const user = getAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if provided (for single element), otherwise render nested routes via Outlet
  return children ?? <Outlet />;
}
