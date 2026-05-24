import { useEffect, useState, useContext } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { PostQueryServiceContext } from "../services/PostQueryServiceContext";
import type { PostQuery } from "../types";
import PostLayout from "../components/PostLayout";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();

  const blogPostService = useContext(PostQueryServiceContext);

  // undefined = loading/not loaded yet
  // null = loaded but not found
  const [post, setPost] = useState<PostQuery | null | undefined>(undefined);

  const [content, setContent] = useState<string | null | undefined>(undefined);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    blogPostService
      ?.getById(id)
      .then((data) => {
        if (cancelled) return;

        setPost(data);

        if (data === null) {
          setError("Post not found.");
        }
      })
      .catch(() => {
        if (cancelled) return;

        setError("Error retrieving post.");
      });

    return () => {
      cancelled = true;
    };
  }, [id, blogPostService]);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    blogPostService
      ?.getContent(id)
      .then((data) => {
        if (cancelled) return;

        setContent(data);

        if (data === null) {
          setError("Post content not found.");
        }
      })
      .catch(() => {
        if (cancelled) return;

        setError("Error retrieving post content.");
      });

    return () => {
      cancelled = true;
    };
  }, [id, blogPostService]);

  if (!id) {
    return <Typography>No post id provided.</Typography>;
  }

  const loading =
    error === null &&
    (post === undefined || content === undefined);

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

  if (!post || !content) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <PostLayout post={post} content={content} />
    </Box>
  );
}