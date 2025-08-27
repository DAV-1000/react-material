import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Author, BlogPost } from "../types";

export interface PostEditorProps {
  post: BlogPost | null;
  onSave: (value: BlogPost) => void; // event callback
  disabled: boolean
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, disabled }) => {
  if(!post) {
    return <Typography variant="h6">No post data available.</Typography>;
  }
  
  const [entity, setEntity] = useState<BlogPost>(
    post 
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorChange = (
    index: number,
    field: keyof Author,
    value: string
  ) => {
    const newAuthors = [...entity.authors];
    newAuthors[index][field] = value;
    setEntity({ ...entity, authors: newAuthors });
  };

  const addAuthor = () => {
    setEntity({
      ...entity,
      authors: [...entity.authors, { name: "", avatar: "" }],
    });
  };

  const removeAuthor = (index: number) => {
    const newAuthors = entity.authors.filter((_, i) => i !== index);
    setEntity({ ...entity, authors: newAuthors });
  };

  const handleSubmit = () => {
    console.log("Upserted Entity:", entity);
    onSave(entity);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="ID"
              name="id"
              value={entity.id}
              onChange={handleChange}
              fullWidth
              disabled={true}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Image URL"
              name="img"
              value={entity.img}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Tags"
              name="tag"
              value={entity.tag}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Title"
              name="title"
              value={entity.title}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description"
              name="description"
              value={entity.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              slotProps={{ htmlInput: { maxLength: 300 } }}
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  alignItems: "flex-start", // allow textarea to expand
                  height: "100px", // don’t collapse to 40px
                },
                "& textarea": {
                  minHeight: "100px", // or whatever you prefer
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">Authors</Typography>
            {entity.authors.map((author, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Grid>
                  <Avatar src={author.avatar} />
                </Grid>
                <Grid size={{ xs: 5 }}>
                  <TextField
                    label="Name"
                    value={author.name}
                    onChange={(e) =>
                      handleAuthorChange(index, "name", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 5 }}>
                  <TextField
                    label="Avatar URL"
                    value={author.avatar}
                    onChange={(e) =>
                      handleAuthorChange(index, "avatar", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid>
                  <IconButton color="error" onClick={() => removeAuthor(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<Add />} variant="outlined" onClick={addAuthor}>
              Add Author
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled= {disabled}
              >
                Save Entity
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PostEditor;
