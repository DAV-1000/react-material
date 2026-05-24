import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useContext, useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";

import PostEditor from "../components/PostEditor";

import { PostCommandServiceContext } from "../services/PostCommandServiceContext";

import { useSnackbar } from "../hooks/useSnackbar";

import { PostCommand } from "../schemas/post.schema";

export default function EditPost() {
  const postCommandService = useContext(PostCommandServiceContext);

  if (!postCommandService) {
    throw new Error("BlogPostServiceContext is not provided");
  }

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  // undefined = loading
  // null = not found
  const [post, setPost] = useState<PostCommand | null | undefined>(
    undefined
  );

  const [requestError, setRequestError] = useState(false);

  const [saving, setSaving] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    postCommandService
      .getById(id)
      .then((data) => {
        if (cancelled) return;

        setPost(data);
      })
      .catch(() => {
        if (cancelled) return;

        setRequestError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [id, postCommandService]);

  if (!id) {
    return <Typography>No post id provided.</Typography>;
  }

  const loading = post === undefined && !requestError;

  let error: string | null = null;

  if (requestError) {
    error = "Error retrieving post.";
  } else if (post === null) {
    error = "Post not found.";
  }

  if (loading) {
    return <Typography>Loading post...</Typography>;
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>

        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Back home
        </Button>
      </Box>
    );
  }

  if (!post) {
    return null;
  }

  const handleSave = async (value: PostCommand) => {
    setSaving(true);

    try {
      await postCommandService.update(value.id, value);

      showSnackbar("Post saved successfully!", "success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error";

      showSnackbar(`Failed to save post: ${message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Edit Post
        </Typography>

        <PostEditor
          post={post}
          onSave={handleSave}
          disabled={saving}
        />

        {SnackbarComponent}
      </div>
    </Box>
  );
}