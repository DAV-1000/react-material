// eslint-disable-next-line react-x/no-use-context
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Card, CardMedia, CardContent, Box, Button } from '@mui/material';
import { BlogPostServiceContext } from '../services/BlogPostServiceContext';
import type { BlogPost }  from '../types';
import ReactMarkdown from "react-markdown";
import PostLayout from '../components/PostLayout';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line react-x/no-use-context
  const blogPostService = useContext(BlogPostServiceContext);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No post id provided.');
      setLoading(false);
      return;
    }

    setLoading(true);

    blogPostService!
      .getById(id)
      .then(data => {
        setPost(data);
        setLoading(false);
        if(data===null) {
          setError('Post not found.');
        }
      })
      .catch(() => {
        setError('Error retrieving post.');
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

  const IMAGE_URL = import.meta.env.VITE_BLOG_IMAGE_URL;

  return (
<PostLayout data={post} />
  );
}
