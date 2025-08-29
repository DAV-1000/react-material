import React, { useContext, useState } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";
import { BlogPostServiceContext } from "../services/BlogPostServiceContext";

interface DeleteButtonProps {
  id?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const { user, userLoading } = useAuth();
  const blogPostService = useContext(BlogPostServiceContext);
 const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  if (!id) return null; 
  if (userLoading) return null;
  if (!user) return null;
  if (!user.userRoles.includes("editor")) return null;

  const handleDelete = async () => {
    try {
      await blogPostService?.delete(id);
      setOpen(false);
      setAlert({
        severity: 'success',
        message: 'Post deleted successfully. Refresh the data grid to see the up to date list of posts',
      });
    } catch (caught) {
      const err = caught instanceof Error ? caught : new Error(String(caught));
      setOpen(false);
      setAlert({
        severity: 'error',
        message: `Error deleting post: ${err.message}`,
      });
    } 
  };

  return (
    <>
      <IconButton
        color="error"
        size="small"
        aria-label="delete post"
        onClick={() => setOpen(true)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

{alert && (
  <Snackbar
    open
    autoHideDuration={6000}
    onClose={() => setAlert(null)}
  >
    <Alert severity={alert.severity}>{alert.message}</Alert>
  </Snackbar>
)}
    </>
  );
};

export default DeleteButton;
