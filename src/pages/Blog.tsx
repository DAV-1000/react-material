
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BlogPostsGrid from '../components/BlogPostsGrid';
import { useBlogPostService } from '../services/BlogPostServiceContext';
import { BlogPost } from '../types';
import { useEffect, useState } from 'react';

export default function Blog() {
 const svc = useBlogPostService();
 const [posts, setPosts] = useState<BlogPost[]>([]);
  //  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  //  const [selectedTag, setSelectedTag] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     svc!.get()
     .then((posts) => {
           setPosts(posts);
         })
       .catch((err) => setError(err.message))
       .finally(() => setLoading(false));
   }, [svc]);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div data-testid="blog-page">
        <Typography variant="h1" gutterBottom>
          Posts
        </Typography>
        <Typography>Browse all articles posted by our contributors</Typography>
      </div>
<BlogPostsGrid rows={posts} initialPageSize={10} />
    </Box>
  );
}
