import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PostEditor from "../components/PostEditor";

export default function EditPost() {

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Edit Post
        </Typography>
        <PostEditor></PostEditor>
      </div>
    </Box>
  );
}
