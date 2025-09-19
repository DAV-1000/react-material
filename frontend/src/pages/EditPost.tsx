import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PostEditor from "../components/PostEditor";
import { PostCommandServiceContext } from "../services/PostCommandServiceContext";
import { useContext, useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";

import { useSnackbar } from "../hooks/useSnackbar";
import { PostCommand } from "../schemas/post.schema";
export default function EditPost() {
  // eslint-disable-next-line react-x/no-use-context
  const postCommandService = useContext(PostCommandServiceContext);

  if (!postCommandService) {
    throw new Error("BlogPostServiceContext is not provided");
  }
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [post, setPost] = useState<PostCommand | null>(null);
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

    postCommandService!
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
  }, [id, postCommandService]);

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

  const handleSave = async (value: PostCommand) => {
    setLoading(true);
    try {
      await postCommandService.update(value.id, value);
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
