import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";

const BlogButton: React.FC = () => {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    // User details being retrieved → show nothing
    return "Loading...";
  }

  if (!user) {
    // User not logged in → show nothing
    return "Log in...";
  }

  // User logged in → check if they are in editor role
  if (!user.userRoles.includes("editor")) {
    return "Unathorized";
  }

  const toRoute = `../blog`;

  return (
    <Button component={RouterLink} to="/blog" variant="text" size="small">
      Blog
    </Button>
  );
};

export default BlogButton;
