import React, { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

import {
  DataGrid,
  GridColDef,
  GridFooterContainer,
  GridRenderCellParams,
} from "@mui/x-data-grid";


import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

import type { Post, Author } from "../types";
import EditPostButton from "./EditPostButton";
import DeletePostButton from "./DeletePostButton";
import BlogPostsGridToolbar from "./BlogPostsGridToolbar";

type Props = {
  rows: Post[];

  // NEW: server-driven controls
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onFilterChange: (tags: string[]) => void;
};

export const BlogPostsGrid: React.FC<Props> = ({
  rows,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onFilterChange,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  // Extract available tags (only for UI dropdown)
  const tags = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => {
      (r.tag ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => s.add(t));
    });
    return Array.from(s).sort();
  }, [rows]);

  const [tagFilter, setTagFilter] = useState<string>("");

  const handleTagChange = (value: string) => {
    setTagFilter(value);
    onFilterChange(value ? [value] : []);
  };

    const CustomFooter = () => (
  <GridFooterContainer>
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1 }}>
      <Button size="small" onClick={onPrev} disabled={!hasPrev}>
        Previous
      </Button>
      <Button size="small" onClick={onNext} disabled={!hasNext}>
        Next
      </Button>
    </Box>
  </GridFooterContainer>
);

  const columns: GridColDef[] = [
    {
      field: "id",
      width: 114,
      renderCell: (params: GridRenderCellParams<Post, string>) => (
        <Stack direction="row" spacing={1} alignItems="center" height="100%">
          <EditPostButton id={params.value} />
          <DeletePostButton id={params.value} />
        </Stack>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Post, string>) => (
        <Link
          component={RouterLink}
          to={`/posts/${params.row.id}`}
          underline="hover"
          onClick={(e) => e.stopPropagation()}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "tag",
      headerName: "Tags",
      width: 200,
      renderCell: (params: GridRenderCellParams<Post, string>) => {
        const tagList = (params.value ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tagList.map((t) => (
              <Chip key={t} label={t} size="small" />
            ))}
          </Stack>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 420,
      renderCell: (params: GridRenderCellParams<Post, string>) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "authors",
      headerName: "Authors",
      renderCell: (params: GridRenderCellParams<Post, Author[]>) => {
        const authors = params.value ?? [];
        return (
          <Stack direction="row" spacing={1}>
            {authors.slice(0, 3).map((a) => (
              <Avatar key={a.name} src={a.avatar} />
            ))}
            {authors.length > 3 && (
              <Typography variant="caption">
                +{authors.length - 3}
              </Typography>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Controls */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Filter by Tag</InputLabel>
          <Select
            value={tagFilter}
            label="Filter by Tag"
            onChange={(e) => handleTagChange(String(e.target.value))}
          >
            <MenuItem value="">All tags</MenuItem>
            {tags.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Paging buttons */}
        <Stack direction="row" spacing={1}>
          <Button onClick={onPrev} disabled={!hasPrev}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={!hasNext}>
            Next
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter={false}
          slots={{
            toolbar: BlogPostsGridToolbar,
    footer: CustomFooter,
  }}
  showToolbar
  sx={{
  borderColor: isLight
    ? theme.palette.grey[200]
    : theme.palette.grey[800],
  "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaders, & .MuiDataGrid-footerContainer":
    {
      borderColor: isLight
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    },
  "& .MuiDataGrid-columnSeparator": {
    color: isLight
      ? theme.palette.grey[300]
      : theme.palette.grey[700],
  },
}}
        />
      </Box>
    </Container>
  );
};

export default BlogPostsGrid;