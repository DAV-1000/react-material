import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PostEditor from "../components/PostEditor";
import { BlogPost } from "../types";
import { BlogPostServiceContext } from "../services/BlogPostServiceContext";
import { useContext, useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useSnackbar } from "../hooks/useSnackbar";
export default function EditPost() {
  // eslint-disable-next-line react-x/no-use-context
  const blogPostService = useContext(BlogPostServiceContext);

  if (!blogPostService) {
    throw new Error("BlogPostServiceContext is not provided");
  }
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [status, setStatus] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (!id) {
      setError("No post id provided.");
      setLoading(false);
      return;
    }

    setLoading(true);

    blogPostService!
      .getById(id)
      .then((data) => {
        setPost(data);
        setLoading(false);
        if (data === null) {
          setError("Post not found.");
        }
      })
      .catch(() => {
        setError("Error retrieving post.");
        setLoading(false);
      });
  }, [id, blogPostService]);

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
        <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 2 }}>
          Back home
        </Button>
      </Box>
    );
  }

  if (!post) {
    return null; // Or a fallback UI
  }

  const handleSave = async (value: BlogPost) => {
    setLoading(true);
    try {
      await blogPostService.update(value.id, value);
      showSnackbar("Post saved successfully!", "success");
    } catch (err: any) {
      showSnackbar(`Failed to save post: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setStatus(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Edit Post
        </Typography>
        <PostEditor
          post={post}
          onSave={handleSave}
          disabled={loading}
        ></PostEditor>
        {SnackbarComponent}
      </div>
    </Box>
  );
}
