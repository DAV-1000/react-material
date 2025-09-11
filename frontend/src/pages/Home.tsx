import * as React from 'react';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import StyledCardItem from '../components/StyledCardItem';
import { useBlogPostService } from '../services/BlogPostServiceContext';
import { BlogPost } from '../types';
import { useEffect, useState } from 'react';
import TagChips from '../components/TagChips';
import type { Tag } from '../types';
import Search from '../components/Search';

  const tags : Tag[] = [
    { tag: null , label: 'All categories' },
    { tag: 'company', label: 'Company' },
    { tag: 'product', label: 'Product' },
    { tag: 'design', label: 'Design' },
    { tag: 'engineering', label: 'Engineering' },
  ];

export default function Home() {
  
  const svc = useBlogPostService();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null,
  );

  useEffect(() => {
    svc!.get()
    .then((posts) => {
          setPosts(posts);
        })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [svc]);

    // This will be called after the debounce time (default 300ms)
  const handleSearchTermChange = (searchTerm: string | null) => {
    setSearchTerm(searchTerm);
    console.log('Search term changed:', searchTerm);
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
        <Typography>Stay in the loop with the latest about our test products</Typography>
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
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCardItem data={posts[0]} 
          index={0} 
          focusedIndex={focusedCardIndex} 
          onFocus={() => handleFocus(0)} 
          onBlur={handleBlur}
          selectedTag={selectedTag}
          searchTerm={searchTerm}  />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCardItem data={posts[1]} 
          index={1} 
          focusedIndex={focusedCardIndex} 
          onFocus={() => handleFocus(1)} 
          onBlur={handleBlur}
          selectedTag={selectedTag}
          searchTerm={searchTerm}  />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StyledCardItem data={posts[2]} 
          index={2} 
          focusedIndex={focusedCardIndex} 
          onFocus={() => handleFocus(2)} 
          onBlur={handleBlur}
          selectedTag={selectedTag}
          searchTerm={searchTerm}  />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
          >
          <StyledCardItem data={posts[3]} 
          index={3} 
          focusedIndex={focusedCardIndex} 
          onFocus={() => handleFocus(3)} 
          onBlur={handleBlur}
          showImage={false}
          selectedTag={selectedTag}
          searchTerm={searchTerm}  />

          <StyledCardItem data={posts[4]} 
          index={4} 
          focusedIndex={focusedCardIndex} 
          onFocus={() => handleFocus(4)} 
          onBlur={handleBlur}
          showImage={false}
          selectedTag={selectedTag}
          searchTerm={searchTerm}  />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StyledCardItem data={posts[5]} 
          index={5} 
          focusedIndex={focusedCardIndex} 
          onFocus={() => handleFocus(5)} 
          onBlur={handleBlur}
          selectedTag={selectedTag}
          searchTerm={searchTerm}  />
        </Grid>
      </Grid>
    </Box>
  );
}
