import Grid from "@mui/material/Grid";
import { Post } from "../types";
import StyledCardItem from "./StyledCardItem";
import Box from "@mui/material/Box";

type StyledCardItemProps = {
  data: Post;
  index: number;
  focusedIndex: number | null;
  onFocus: () => void;
  onBlur: () => void;
  showImage?: boolean;
  selectedTag: string | null;
  searchTerm: string | null;
};

type LayoutSection = {
    id: string;
    md: number;
    indices: number[];
    stacked?: boolean;
    showImage?: boolean;
};

type PostsLayoutProps = {
  posts: Post[];
  layout: LayoutSection[];
  focusedCardIndex: number | null;
  handleFocus: (index: number) => void;
  handleBlur: () => void;
  selectedTag: string | null;
  searchTerm: string | null;
};

const PostsLayout: React.FC<PostsLayoutProps> = ({
  posts = [],
  layout,
  focusedCardIndex,
  handleFocus,
  handleBlur,
  selectedTag,
  searchTerm,
}: PostsLayoutProps) => {

const getCardProps = (
  index: number,
  post: Post,
  extra: Partial<Omit<StyledCardItemProps, "data" | "index">> = {}
): StyledCardItemProps => ({
  data: post,
  index,
  focusedIndex: focusedCardIndex,
  onFocus: () => handleFocus(index),
  onBlur: handleBlur,
  selectedTag,
  searchTerm,
  ...extra,
});

  return (
    <Grid container spacing={2} columns={12}>
      {layout.map((section) => {
        const validPosts = section.indices
          .map(i => posts[i])
          .filter(Boolean);

        if (validPosts.length === 0) return null;

        return (
          <Grid key={section.id} size={{ xs: 12, md: section.md }}>
            {section.stacked ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                {validPosts.map((post, i) => {
                  const index = section.indices[i];
                  const props = getCardProps(index, post, {
                    showImage: section.showImage ?? true,
                  }); 
                  return (
                    <StyledCardItem
                      key={index} {...props}
                    />
                  );
                })}
              </Box>
            ) : (
              validPosts.map((post, i) => {
                const index = section.indices[i];
                const props = getCardProps(index, post, {
                  showImage: section.showImage ?? true,
                });
                return (
                  <StyledCardItem
                    key={index} {...props}
                  />
                );
              })
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PostsLayout;