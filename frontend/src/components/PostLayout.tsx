import {
  Box,
  Card,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Authors from "./Authors";
import { BlogPost } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostLayoutProps {
  post?: BlogPost;
  content?: string;
}

const PostLayout: React.FC<PostLayoutProps> = ({
  post: data, content: markdownContent
}) => {

  if (!data) {
    return '';
  }

  const IMAGE_URL = import.meta.env.VITE_BLOG_IMAGE_URL;
  
  return (
     <Container maxWidth="lg" sx={{ py: 6 }}>
      
      {/* Title */}
      <Typography variant="h2" gutterBottom component="h1" sx={{ mb: 4 }}>
        { data.title}
      </Typography>

      {/* Main Image */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <CardMedia
          component="img"
        alt={data.title}
        image={IMAGE_URL + data.img}
          sx={{ borderRadius: 3 }}
        />
      </Card>

      {/* Authors */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Authors authors={data.authors} />
      </Box>

            <Typography
        variant="body2"
        component="p"
        sx={{ fontStyle: "italic", mb: 4 }}
      >
        { data.description }
      </Typography>

      {/* Text Content */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Box>
<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostLayout;
