import React from "react";
import { Button } from "@mui/material"; // or your UI lib
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

interface AuthButtonsProps {
  id?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ id }) => {
  if (!id) {
    return null;
  }

  const { user, userLoading } = useAuth();

  if (userLoading) {
    // User details being retrieved → show nothing
    return null;
  }

  if (!user) {
    // User not logged in → show nothing
    return null;
  }

  // User logged in → check if they are in editor role
  if (!user.userRoles.includes("editor")) {
    return null;
  }

  const toRoute = `../edit-post/${encodeURIComponent(id)}`;

  return (
    <Button
      component={RouterLink}
      to={toRoute}
      color="secondary"
      variant="text"
      size="small"
    >
      Edit
    </Button>
  );
};

export default AuthButtons;
