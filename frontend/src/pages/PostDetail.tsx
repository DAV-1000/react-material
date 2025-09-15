// eslint-disable-next-line react-x/no-use-context
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { BlogPostServiceContext } from "../services/BlogPostServiceContext";
import type { BlogPost } from "../types";
import PostLayout from "../components/PostLayout";
import EditPostButton from "../components/EditPostButton";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line react-x/no-use-context
  const blogPostService = useContext(BlogPostServiceContext);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!id) {
      setError("No post id provided.");
      setLoadingContent(false);
      return;
    }

    setLoadingContent(true);

    blogPostService!
      .getContent(id ?? null)
      .then((content) => {
        setContent(content);
        setLoading(false);
        if (content === null) {
          setError("Post content not found.");
        }
      })
      .catch(() => {
        setError("Error retrieving post content.");
        setLoading(false);
      });
  }, [id, blogPostService]);

  if (loading) {
    return <Typography>Loading post...</Typography>;
  }

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <PostLayout post={post} content={content} />
    </Box>
  );
}
