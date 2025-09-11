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
import { PostSchema } from "../schemas";
import { z, ZodIssue } from "zod";

export interface PostEditorProps {
  post: BlogPost | null;
  onSave: (value: BlogPost) => void; // event callback
  disabled: boolean;
}

type ValidationErrors = Partial<Record<string, string>>;

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, disabled }) => {
  if (!post) {
    return <Typography variant="h6">No post data available.</Typography>;
  }

  const [entity, setEntity] = useState<BlogPost>(post);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntity((prev: BlogPost) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error when typing
  };

  const handleAuthorChange = (
    index: number,
    field: keyof Author,
    value: string
  ) => {
    const newAuthors = [...entity.authors];
    newAuthors[index][field] = value;
    setEntity({ ...entity, authors: newAuthors });
    setErrors((prev) => ({ ...prev, [`authors.${index}.${field.toString()}`]: "" }));
  };

  const addAuthor = () => {
    setEntity({
      ...entity,
      authors: [...entity.authors, { name: "", avatar: "" }],
    });
  };

  const removeAuthor = (index: number) => {
    const newAuthors = entity.authors.filter((_: Author, i: number) => i !== index);
    setEntity({ ...entity, authors: newAuthors });
  };

  const handleSubmit = () => {
    // ✅ validate with zod
    const result = PostSchema.safeParse(entity);

    if (!result.success) {
      // Collect errors into a flat object for form display
      const fieldErrors: ValidationErrors = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // If valid
    console.log("✅ Upserted Entity:", result.data);
      const validEntity = {
    ...result.data,
    tag: (result.data.tag as string[]).join(", ") // convert array back to string
  };

  onSave(validEntity); // matches BlogPost type
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
              disabled
              error={!!errors.id}
              helperText={errors.id}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Image URL"
              name="img"
              value={entity.img}
              onChange={handleChange}
              fullWidth
              error={!!errors.img}
              helperText={errors.img}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Tags"
              name="tag"
              value={entity.tag}
              onChange={handleChange}
              fullWidth
              error={!!errors.tag}
              helperText={errors.tag}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Title"
              name="title"
              value={entity.title}
              onChange={handleChange}
              fullWidth
              error={!!errors.title}
              helperText={errors.title}
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
              error={!!errors.description}
              helperText={errors.description}
              slotProps={{ htmlInput: { maxLength: 300 } }}
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  alignItems: "flex-start",
                  height: "100px",
                },
                "& textarea": {
                  minHeight: "100px",
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">Authors</Typography>
            {entity.authors.map((author: Author, index: number) => (
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
                    error={!!errors[`authors.${index}.name`]}
                    helperText={errors[`authors.${index}.name`]}
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
                    error={!!errors[`authors.${index}.avatar`]}
                    helperText={errors[`authors.${index}.avatar`]}
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
                disabled={disabled}
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
