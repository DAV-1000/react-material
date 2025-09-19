import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PostEditor from "../components/PostEditor";
import { PostCommandServiceContext } from "../services/PostCommandServiceContext";
import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { useSnackbar } from "../hooks/useSnackbar";
import { newPost, PostCommand } from "../schemas/post.schema";

export default function EditPost() {
  // eslint-disable-next-line react-x/no-use-context
  const blogPostService = useContext(PostCommandServiceContext);
  const [loading, setLoading] = useState(false);

  if (!blogPostService) {
    throw new Error("BlogPostServiceContext is not provided");
  }
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [status, setStatus] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const post: PostCommand =   newPost();

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
      await blogPostService.create(value);
      showSnackbar("Post created successfully!", "success");
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
          Create Post
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
