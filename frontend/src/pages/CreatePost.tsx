import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PostEditor from "../components/PostEditor";
import { PostCommandServiceContext } from "../services/PostCommandServiceContext";
import { useContext, useState } from "react";
import { useSnackbar } from "../hooks/useSnackbar";
import { newPost, PostCommand } from "../schemas/post.schema";

import { useNavigate } from "react-router-dom";

export default function EditPost() {

  const postCommandService = useContext(PostCommandServiceContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const post: PostCommand = newPost();

  if (!post) {
    return null; // Or a fallback UI
  }

  const handleSave = async (value: PostCommand) => {
    setLoading(true);
    try {
      const createdPost = await postCommandService!.create(value);
      showSnackbar("Post created successfully!", "success", () => {
        navigate(`/${createdPost.id}/edit`);
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error";

      showSnackbar(`Failed to save post: ${message}`, "error");
    } finally {
      setLoading(false);
    }
  };

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
