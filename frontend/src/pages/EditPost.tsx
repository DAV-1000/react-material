import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PostEditor from "../components/PostEditor";
import { BlogPost } from "../types";
import { BlogPostServiceContext } from "../services/BlogPostServiceContext";
import { useContext, useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line react-x/no-use-context
  const blogPostService = useContext(BlogPostServiceContext);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) {
      setError("No post id provided.");
      setLoading(false);
      return;
    }

    setLoading(true);

    blogPostService!
      .getById(id)
      .then((data) => {
        setPost(data);
        setLoading(false);
        if (data === null) {
          setError("Post not found.");
        }
      })
      .catch(() => {
        setError("Error retrieving post.");
        setLoading(false);
      });
  }, [id, blogPostService]);

    if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
        <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 2 }}>
          Back home
        </Button>
      </Box>
    );
  }

  if (!post) {
    return null; // Or a fallback UI
  }

  async function handleSave(value: BlogPost): Promise<void> {
    const updated = await blogPostService!.update(value.id, value);
    console.log(updated);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Edit Post
        </Typography>
        <PostEditor post={post} onSave={handleSave}></PostEditor>
      </div>
    </Box>
  );
}
