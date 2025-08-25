import React from "react";
import { Button } from "@mui/material"; // or your UI lib
import { useAuth } from "../hooks/useAuth";

const AuthButtons: React.FC = () => {
  const user = useAuth();

  if (!user) {
    // User not logged in → show Sign In
    return (
      <a href={`${window.location.origin}/.auth/login/github`}>
        <Button color="primary" variant="text" size="small">
          Sign in with GitHub
        </Button>
      </a>
    );
  }

  // User logged in → show Sign Out
  return (
    <a href={`${window.location.origin}/.auth/logout`}>
      <Button color="secondary" variant="text" size="small">
        Sign out ({user.userDetails})
      </Button>
    </a>
  );
};

export default AuthButtons;
