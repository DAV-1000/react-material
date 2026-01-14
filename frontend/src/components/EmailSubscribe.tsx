import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAuth } from "../context/AuthContext";

interface EmailSubscribeProps {
  onSubscribe: (email: string) => void;
}

const EmailSubscribe: React.FC<EmailSubscribeProps> = ({ onSubscribe }) => {
  const { user, userLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const validateEmail = (email: string) => {
    // Basic regex for email format validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSubscribe = () => {
    if (validateEmail(email)) {
      setError(false);
      onSubscribe(email);
      setEmail(""); // Clear after successful submit
    } else {
      setError(true);
    }
  };
    // User logged in → check if they are in editor role
  if (!user?.userRoles?.includes("authenticated")) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} useFlexGap>
      <Box
        display="flex"
        alignItems="flex-start"
        gap={1}
      >
        <TextField
          id="email-newsletter"
          hiddenLabel
          size="small"
          variant="outlined"
          fullWidth
          aria-label="Enter your email address"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          helperText={error ? "Please enter a valid email address" : ""}
          slotProps={{
            htmlInput: {
              autoComplete: "off",
              "aria-label": "Enter your email address",
            },
          }}
          sx={{ width: "250px" }}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ flexShrink: 0 }}
          onClick={handleSubscribe}
        >
          Subscribe
        </Button>
      </Box>
    </Stack>
  );
};

export default EmailSubscribe;
