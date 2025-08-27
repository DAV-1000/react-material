import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
const { user, userLoading } = useAuth();

  if (userLoading) {
    // User details being retrieved → show nothing
    return null;
  }

  if (!user) {
    // Not logged in → redirect to home or login
    return <Navigate to="/" replace />;
  }

  // User logged in → check if they are in editor role
  if (!user.userRoles.includes("editor")) {
    return null;
  }

  // Logged in → allow access
  return children;
};

export default ProtectedRoute;
