import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Suspense, lazy } from 'react';

const BlogPostsGrid = lazy(() => import('../components/BlogPostsGrid'));

import { usePostQueryService } from '../services/PostQueryServiceContext';
import { Post } from '../types';
import { useEffect, useState, useCallback } from 'react';

export default function Blog() {
  const svc = usePostQueryService();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts function that can be reused
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await svc!.get();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [svc]);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div data-testid="blog-page">
        <Typography variant="h1" gutterBottom>
          Posts
        </Typography>
        <Typography>Browse all articles posted by our contributors</Typography>
        <Button variant="outlined" onClick={fetchPosts} sx={{ mt: 2 }}>
          Refresh
        </Button>
      </div>
      <BlogPostsGrid refreshPosts={fetchPosts} rows={posts} initialPageSize={10} />
    </Box>
  );
}
