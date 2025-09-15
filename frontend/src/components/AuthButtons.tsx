import React from "react";
import Button from "@mui/material/Button"; // or your UI lib
import { useAuth } from "../context/AuthContext";

const AuthButtons: React.FC = () => {
  const { user, userLoading } = useAuth();

  const currentPath: string = window.location.pathname + window.location.search;
  
  if (userLoading) {
    // User details being retrieved → show nothing
    return null;
  }

  if (!user) {
    // User not logged in → show Sign In
    return (
      <a href={`/.auth/login/github?post_login_redirect_uri=${encodeURIComponent(currentPath)}`}>
        <Button color="primary" variant="text" size="small">
          Sign in with GitHub
        </Button>
      </a>
    );
  }

  // User logged in → show Sign Out
  return (
    <a href={`/.auth/logout`}>
      <Button color="secondary" variant="text" size="small">
        Sign out ({user.userDetails})
      </Button>
    </a>
  );
};

export default AuthButtons;
