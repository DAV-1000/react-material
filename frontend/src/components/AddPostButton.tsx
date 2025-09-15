import React from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const AddButton: React.FC = () => {

  const { user, userLoading } = useAuth();

  if (userLoading) {
    // User details being retrieved → show nothing
    return null;
  }

  if (!user) {
    // User not logged in → show nothing
    return null;
  }

  // User logged in → check if they are in Editor role
  if (!user.userRoles.includes("editor")) {
    return null;
  }

  const toRoute = `../create-post`;

  return (
    <IconButton
      component={RouterLink}
      to={toRoute}
      color="secondary"
      size="small"
      aria-label="Add post"
    >
      <AddIcon fontSize="small" />
    </IconButton>
  );
};

export default AddButton;
