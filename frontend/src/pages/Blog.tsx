import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { lazy, useEffect, useState, useCallback } from 'react';

const BlogPostsGrid = lazy(() => import('../components/BlogPostsGrid'));

import { usePostQueryService } from '../services/PostQueryServiceContext';
import { Post } from '../types';

export default function Blog() {
  const svc = usePostQueryService();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // --- Load current page ---
const load = useCallback(
  async (params?: { tags?: string[] }) => {
    setLoading(true);
    setError(null);

    try {
      // reset pagination when filters are applied
      if (params?.tags) {
        svc!.reset();
      }

      const res = await svc!.getFiltered({
        pageSize: 10,
        tags: params?.tags,
      });

      setPosts(res.data);
      setHasNext(res.hasNext);
      setHasPrev(res.hasPrev);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  },
  [svc]
);

  // --- Next page ---
  const handleNext = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await svc!.next({ pageSize: 10 });

      setPosts(res.data);
      setHasNext(res.hasNext);
      setHasPrev(res.hasPrev);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [svc]);

  // --- Previous page ---
  const handlePrev = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await svc!.prev({ pageSize: 10 });

      setPosts(res.data);
      setHasNext(res.hasNext);
      setHasPrev(res.hasPrev);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [svc]);

  // --- Initial load ---
  useEffect(() => {
    svc?.reset(); // important: start fresh
    load();
  }, [svc, load]);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div data-testid="blog-page">
        <Typography variant="h1" gutterBottom>
          Posts
        </Typography>

        <Typography>
          Browse all articles posted by our contributors
        </Typography>
      </div>

<BlogPostsGrid
  rows={posts}
  hasNext={hasNext}
  hasPrev={hasPrev}
  onNext={handleNext}
  onPrev={handlePrev}
  onFilterChange={(tags) => {
    svc!.reset();
    load({ tags }); 
  }}
/>
    </Box>
  );
}