import { useState, ReactNode, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";

interface SnackbarMessage {
  message: string | ReactNode;
  severity: Severity;
}

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const showSnackbar = useCallback((message: string | ReactNode, severity: Severity = "info") => {
    setSnackbar({ message, severity });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar(null);
  }, []);

  const SnackbarComponent = snackbar ? (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  ) : null;

  return { showSnackbar, SnackbarComponent };
}
