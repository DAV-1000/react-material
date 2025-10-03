import { useState, ReactNode, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type Severity = "success" | "error" | "info" | "warning";

interface SnackbarMessage {
  message: string | ReactNode;
  severity: Severity;
  onClose?: () => void; // ✅ added here
}

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const showSnackbar = useCallback(
    (
      message: string | ReactNode,
      severity: Severity = "info",
      onClose?: () => void
    ) => {
      setSnackbar({ message, severity, onClose });
    },
    []
  );

  const handleClose = useCallback(() => {
    if (snackbar?.onClose) {
      snackbar.onClose(); // ✅ run callback on close
    }
    setSnackbar(null);
  }, [snackbar]);

  const SnackbarComponent = snackbar ? (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  ) : null;

  return { showSnackbar, SnackbarComponent };
}
