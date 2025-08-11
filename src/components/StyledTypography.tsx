import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export default StyledTypography;