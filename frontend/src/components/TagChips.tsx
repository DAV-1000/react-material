
import Chip from '@mui/material/Chip';
import type { Tag } from '../types';

interface TagChipsProps {
  tags: Tag[];
  selectedTag: string | null
  onChipClick?: (chipTag: string | null) => void;
}

export default function TagChips({ tags, selectedTag, onChipClick: onSelectionChange }: TagChipsProps) {

  const handleTagClick = (tag: string | null) => {
      if (onSelectionChange) {
        onSelectionChange(tag);
      }
  };

  const getChipStyles = (tag: string | null) => ({
    backgroundColor: selectedTag === tag ? 'grey.100' : 'transparent',
    color: selectedTag === tag ? 'white' : 'text.primary',
    borderColor: selectedTag === tag ? 'grey.400' : 'white',
    cursor: 'pointer',
  });

  return (
    <>
      {tags.map(({ tag, label }) => (
        <Chip
          key={tag}
          onClick={() => handleTagClick(tag)}
          size="medium"
          label={label}
          sx={getChipStyles(tag)}
        />
      ))}
    </>
  );
}
