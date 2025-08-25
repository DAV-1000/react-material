import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth"; // the hook we wrote earlier

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAuth();

  if (!user) {
    // Not logged in → redirect to home or login
    return <Navigate to="/" replace />;
  }

  // Logged in → allow access
  return children;
};

export default ProtectedRoute;
