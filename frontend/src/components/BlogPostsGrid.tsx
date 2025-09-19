// BlogPostsGrid.tsx
import React, { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import BlogPostsGridToolbar from "./BlogPostsGridToolbar";

import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
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

import type { Post, Author } from "../types";
import EditPostButton from "./EditPostButton";
import DeletePostButton from "./DeletePostButton";

const defaultPageSizeOptions = [5, 10, 25]; // Default page size options

type Props = {
  rows: Post[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  refreshPosts?: () => void; // TODO implement server side paging etc.
};

const DEFAULT_PAGE_SIZE = 10;

export const BlogPostsGrid: React.FC<Props> = ({
  rows,
  initialPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = defaultPageSizeOptions,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  // Unique tag extraction (flatten comma-separated values)
  const tags = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => {
      const tagStr = r.tag ?? "";
      tagStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => s.add(t));
    });
    return Array.from(s).sort();
  }, [rows]);

  // Tag filter state
  const [tagFilter, setTagFilter] = useState<string>("");

  // Pagination model (v8)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: initialPageSize ?? DEFAULT_PAGE_SIZE,
  });

  // Client-side tag filtering applied before passing to DataGrid
  const filteredRows = useMemo(() => {
    if (!tagFilter) return rows;
    return rows.filter((r) => {
      const tagStr = r.tag ?? "";
      const parts = tagStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      return parts.includes(tagFilter);
    });
  }, [rows, tagFilter]);

  // Columns typed with BlogPost generic for correct params.row typing
  const columns: GridColDef[] = [
    {
      field: "id",
      width: 114,
      minWidth: 114,
      maxWidth: 114,
      sortable: false, // prevent sorting
      filterable: false, // prevent filtering
      disableColumnMenu: true, // hide the column menu
      hideable: false, // hide from column chooser / column panel
      headerName: "",
      renderCell: (params: GridRenderCellParams<Post, string>) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            sx={{ height: "100%", alignItems: "center" }}
          >
            <EditPostButton id={params.value} />
            <DeletePostButton id={params.value} />
          </Stack>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Post, string>) => {
        // stopPropagation prevents DataGrid row click/selection from also being triggered
        const handleClick = (event: React.MouseEvent) => {
          event.stopPropagation();
        };

        return (
          <Link
            component={RouterLink}
            to={`/posts/${params.row.id}`}
            underline="hover"
            onClick={handleClick}
            // optional: style or typography props here
          >
            {params.value}
          </Link>
        );
      },
    },
    {
      field: "tag",
      headerName: "Tags",
      width: 200,
      sortable: true,
      filterable: true,
      renderCell: (
        params: GridRenderCellParams<Post, string | undefined>
      ) => {
        const tagString = params.value ?? "";
        const tagList = tagString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        return (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{ height: "100%", alignItems: "center" }}
          >
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
      sortable: false,
      filterable: false,
      renderCell: (
        params: GridRenderCellParams<Post, string | undefined>
      ) => (
        <Box
          sx={{
            height: "100%", // Fill the entire cell height
            display: "flex", // Enable flex layout
            alignItems: "center", // Vertically center content
          }}
        >
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
        </Box>
      ),
    },
    {
      field: "authors",
      headerName: "Authors",
      sortable: false,
      filterable: false,
      renderCell: (
        params: GridRenderCellParams<Post, string | undefined>
      ) => {
        // Force authors to always be an array
        const authors: Author[] =
          params && Array.isArray(params.value) ? params.value : [];
        return (
          <Stack
            direction="row"
            spacing={1}
            sx={{ height: "100%", alignItems: "center" }}
          >
            {authors.slice(0, 3).map((a) => (
              <Avatar
                key={a.name}
                src={a.avatar}
                sx={{ width: 28, height: 28 }}
                alt={a.name}
              />
            ))}
            {authors.length > 3 ? (
              <Typography variant="caption">{`+${
                authors.length - 3
              }`}</Typography>
            ) : null}
          </Stack>
        );
      },
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Controls above the grid — simpler and avoids broken composition imports */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        {/* Tag filter */}
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="tag-filter-label">Filter by Tag</InputLabel>
          <Select
            labelId="tag-filter-label"
            label="Filter by Tag"
            value={tagFilter}
            onChange={(e) => setTagFilter(String(e.target.value))}
          >
            <MenuItem value="">All tags</MenuItem>
            {tags.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* (Optional) You could add more top-level controls here */}
      </Stack>

      {/* DataGrid with the built-in toolbar & quick filter (showToolbar) */}
      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid<Post>
          rows={filteredRows}
          sx={{
            borderColor: isLight
              ? theme.palette.grey[200]
              : theme.palette.grey[100],
            "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaders, & .MuiDataGrid-footerContainer":
              {
                borderColor: isLight
                  ? theme.palette.grey[200]
                  : theme.palette.grey[100],
              },
            "& .MuiDataGrid-columnSeparator": {
              color: isLight
                ? theme.palette.grey[200]
                : theme.palette.grey[100],
            },
          }}
          columns={columns}
          slots={{
            toolbar:BlogPostsGridToolbar }}


          showToolbar
          // pagination (v8 uses paginationModel)
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={(model: GridPaginationModel) =>
            setPaginationModel(model)
          }
          pageSizeOptions={pageSizeOptions}
          disableRowSelectionOnClick={true}
          // default sorting order
          sortingOrder={["asc", "desc"]}
          // ensure initial pagination state matches initialPageSize
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: initialPageSize },
            },
          }}
          // performance: make sure autoHeight isn't used when virtualization desired
        />
      </Box>
    </Container>
  );
};

export default BlogPostsGrid;
