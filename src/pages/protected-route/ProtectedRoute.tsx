import { ReactNode } from "react";
import { RouteProps, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export type AppRouteProps = RouteProps & {
  children: ReactNode;
  admin?: boolean;
};

export default function ProtectedRoute({ children, admin }: AppRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if ((admin && !isAdmin) || !isAuthenticated) {
    return (
      <Navigate to={isAuthenticated ? "/app/vacations" : "/signin"} replace />
    );
  }

  return <>{children}</>;
}
