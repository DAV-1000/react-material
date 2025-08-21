import React from 'react';
import { Typography, CardMedia, CardActionArea } from '@mui/material';
import StyledCard from './StyledCard.tsx'; // adjust if needed
import StyledCardContent from './StyledCardContent.tsx';
import StyledTypography from './StyledTypography.tsx'; // if you have one
import Author from './Author.tsx';
import type  { BlogPost }  from '../types'; 
import { Link as RouterLink } from 'react-router-dom';

interface StyledCardItemProps {
  data?: BlogPost;
  index: number;
  focusedIndex: number | null;
  onFocus: (index: number) => void;
  onBlur: () => void;
  showImage?: boolean; // Optional prop to control image rendering
  selectedTag: string | null;
  searchTerm: string | null;
}

const StyledCardItem: React.FC<StyledCardItemProps> = ({
  data,
  index,
  focusedIndex,
  onFocus,
  onBlur,
  showImage = true, 
  selectedTag,
  searchTerm,

}) => {

  if (!data) {
    return '';
  }

  const toRoute = `../posts/${encodeURIComponent(data.id)}`;

  const matchesSearch = !searchTerm || data.title.toLowerCase().includes(searchTerm.toLowerCase()) || data.description.toLowerCase().includes(searchTerm.toLowerCase());

  // const tags = data.tag.split(',').map(tag => tag.trim().toLowerCase());
  // const matchesTagFilter = selectedTag !== null && !tags.includes(selectedTag);

  if (!data) {
    return ''; 
  }

  const IMAGE_URL = import.meta.env.VITE_BLOG_IMAGE_URL;
  
  return (
    <StyledCard
      variant="outlined"
      onFocus={() => onFocus(index)}
      onBlur={onBlur}
      tabIndex={0}
      className={`${focusedIndex === index ? 'Mui-focused' : ''} ${!matchesSearch ? 'disabled-card' : ''}`}
      sx={{ height: '100%' }}
    >
          <CardActionArea
        component={RouterLink}
        to={toRoute}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', textDecoration: 'none' }}
      >
        {showImage  && (
      <CardMedia
        component="img"
        alt={data.title}
        image={IMAGE_URL + data.img}
        sx={{
          aspectRatio: '16 / 9',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />)}
      <StyledCardContent>
<Typography gutterBottom variant="caption" component="div" aria-label="tags">
  {(() => {
    const raw = data.tag ?? '';
    // build array of trimmed, non-empty tags
    const tags = raw
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // sort case-insensitively but keep original casing for display
    tags.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
    );

    const normalizedSelected = selectedTag?.trim().toLowerCase() ?? null;

    return tags.length === 0 ? (
      <span>-</span>
    ) : (
      tags.map((tag, idx) => {
        const isMatch = normalizedSelected !== null && tag.toLowerCase() === normalizedSelected;
        return (
          <span key={tag}>
            <span style={{ fontWeight: isMatch ? 700 : 400 }}>{tag}</span>
            {idx < tags.length - 1 ? ', ' : ''}
          </span>
        );
      })
    );
  })()}
</Typography>
        <Typography gutterBottom variant="h6" component="div">
          {data.title}
        </Typography>
        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
          {data.description}
        </StyledTypography>
      </StyledCardContent>
      <Author authors={data.authors} />
      </CardActionArea>
    </StyledCard>
  );
};

export default StyledCardItem;
