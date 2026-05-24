import {
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  ExportCsv,
  ExportPrint,
} from "@mui/x-data-grid";

import Tooltip from "@mui/material/Tooltip";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import Badge from "@mui/material/Badge";

import { GridToolbarProps } from '@mui/x-data-grid';
import AddPostButton from "./AddPostButton";

export interface BlogPostsGridToolbarProps extends GridToolbarProps {
    refreshPosts: () => void; // TODO implement server side paging etc and refactor this out.
}

const BlogPostsGridToolbar: React.FC = ( ) => {

  return (
    <Toolbar>
     <AddPostButton />
      {/* <Tooltip title="Refresh">
        <ToolbarButton onClick={handleRefresh}>
          <RefreshIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip> */}
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
      <Tooltip title="Download as CSV">
        <ExportCsv render={<ToolbarButton />}>
          <FileDownloadIcon fontSize="small" />
        </ExportCsv>
      </Tooltip>
      <Tooltip title="Print">
        <ExportPrint render={<ToolbarButton />}>
          <PrintIcon fontSize="small" />
        </ExportPrint>
      </Tooltip>
      <Tooltip title="Filters" >
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge
                badgeContent={state.filterCount}
                color="primary"
                variant="dot"
              >
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>
    </Toolbar>
  );
};

export default BlogPostsGridToolbar;
