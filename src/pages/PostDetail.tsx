// src/pages/PostDetail.tsx
// eslint-disable-next-line react-x/no-use-context
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Card, CardMedia, CardContent, Box, Button } from '@mui/material';
import { BlogPostServiceContext } from '../services/BlogPostServiceContext';
import type { BlogPost }  from '../types';

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

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto' }}>
      {post.img && (
        <CardMedia
          component="img"
          image={post.img}
          alt={post.title}
          sx={{ aspectRatio: '16 / 9' }}
        />
      )}
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Tags: {post.tag || '-'}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
