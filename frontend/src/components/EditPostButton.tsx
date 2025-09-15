import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

interface EditButtonProps {
  id?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ id }) => {
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
    <IconButton
      component={RouterLink}
      to={toRoute}
      color="secondary"
      size="small"
      aria-label="edit post"
    >
      <EditIcon fontSize="small" />
    </IconButton>
  );
};

export default EditButton;
