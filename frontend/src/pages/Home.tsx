import * as React from 'react';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import StyledCardItem from '../components/StyledCardItem';
import { usePostQueryService } from '../services/PostQueryServiceContext';
import { useEffect, useState } from 'react';
import TagChips from '../components/TagChips';
import type { PostQuery, Tag } from '../types';
import Search from '../components/Search';
import { GetFilteredParams } from '../services/PostQueryService';
import PostsLayout from '../components/PostsLayout';

  const tags : Tag[] = [
    { tag: null , label: 'All categories' },
    { tag: 'company', label: 'Company' },
    { tag: 'product', label: 'Product' },
    { tag: 'design', label: 'Design' },
    { tag: 'engineering', label: 'Engineering' },
  ];

export default function Home() {
  
  const svc = usePostQueryService();
  const [posts, setPosts] = useState<PostQuery[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null,
  );

  const homepageLayout = [
  { id: "hero-left", md: 6, indices: [0] },
  { id: "hero-right", md: 6, indices: [1] },
  { id: "feature", md: 4, indices: [2] },
  { id: "stacked", md: 4, indices: [3, 4], stacked: true, showImage: false },
  { id: "side", md: 4, indices: [5] },
];

  useEffect(() => {
    const params: GetFilteredParams = {};
    if(selectedTag) {
      params.tags = [selectedTag];
    }

    svc!.getFiltered(params)
    .then((posts) => {
          setPosts(posts.data);
        })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [svc, selectedTag]);

    // This will be called after the debounce time (default 300ms)
  const handleSearchTermChange = (searchTerm: string | null) => {
    setSearchTerm(searchTerm);
  };

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(prev => (prev === tag ? null : tag)); // toggle off if same
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Welcome
        </Typography>
        <Typography>Stay in the loop with the latest about our products</Typography>
      </div>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          gap: 1,
          width: { xs: '100%', md: 'fit-content' },
          overflow: 'auto',
        }}
      >
        <Search />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          <TagChips tags={tags} selectedTag={selectedTag} onChipClick={handleTagClick} />
        </Box>
        
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: 1,
            width: { xs: '100%', md: 'fit-content' },
            overflow: 'auto',
          }}
        >
          <Search 
          onChange={handleSearchTermChange} 
          placeholder="Search items..."  />

        </Box>
      </Box>
<PostsLayout
  posts={posts}
  layout={homepageLayout}
  focusedCardIndex={focusedCardIndex}
  handleFocus={handleFocus}
  handleBlur={handleBlur}
  selectedTag={selectedTag}
  searchTerm={searchTerm}
/>
    </Box>
  );
}
