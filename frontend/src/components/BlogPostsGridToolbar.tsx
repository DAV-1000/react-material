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
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useGridApiContext } from "@mui/x-data-grid";
import { Badge } from "@mui/material";

import { GridToolbarProps } from '@mui/x-data-grid';

export interface BlogPostsGridToolbarProps extends GridToolbarProps {
    refreshPosts: () => void; // TODO implement server side paging etc and refactor this out.
}

const BlogPostsGridToolbar: React.FC = ( ) => {
  const apiRef = useGridApiContext();

  const handleRefresh = () => {
    // This refreshes the grid rows
    apiRef.current?.updateRows([]);
    // Or trigger a full reload depending on your data fetching strategy
  };
  return (
    <Toolbar>
      <Tooltip title="Add new">
        <ToolbarButton
          // ref={newPanelTriggerRef}
          aria-describedby="new-panel"
          // onClick={() => setNewPanelOpen((prev) => !prev)}
        >
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
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
