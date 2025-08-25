import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import Sitemark from "./SitemarkIcon";

import { Link as RouterLink } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 1 }}>
              <Button component={RouterLink} to="/" variant="text" size="small">
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/features"
                variant="text"
                color="info"
                size="small"
              >
                Features
              </Button>
              <Button
                component={RouterLink}
                to="/testimonials"
                variant="text"
                color="info"
                size="small"
              >
                Testimonials
              </Button>
              <Button
                component={RouterLink}
                to="/highlights"
                variant="text"
                color="info"
                size="small"
              >
                Highlights
              </Button>
              <Button
                component={RouterLink}
                to="/pricing"
                variant="text"
                color="info"
                size="small"
              >
                Pricing
              </Button>
              <Button
                component={RouterLink}
                to="/faq"
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
              >
                FAQ
              </Button>
              <Button
                component={RouterLink}
                to="/blog"
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
              >
                Blog
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {
              <a
                href={`/.auth/login/github`}
                style={{ textDecoration: "none" }}
              >
                <Button color="primary" variant="text" size="small">
                  Sign in with GitHub
                </Button>
              </a>
            }
            {
              <a href={`$/.auth/logout`} style={{ textDecoration: "none" }}>
                <Button color="primary" variant="text" size="small">
                  Signout
                </Button>
              </a>
            }
            {/* <Button color="primary" variant="text" size="small">
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small">
              Sign up
            </Button> */}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem
                  component={RouterLink}
                  to="/features"
                  onClick={toggleDrawer(false)}
                >
                  Features
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/testimonials"
                  onClick={toggleDrawer(false)}
                >
                  Testimonials
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/highlights"
                  onClick={toggleDrawer(false)}
                >
                  Highlights
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/pricing"
                  onClick={toggleDrawer(false)}
                >
                  Pricing
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/faq"
                  onClick={toggleDrawer(false)}
                >
                  FAQ
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/blog"
                  onClick={toggleDrawer(false)}
                >
                  Blog
                </MenuItem>

                <Divider sx={{ my: 3 }} />

                {/* <MenuItem>
      <Button component={RouterLink} to="/signup" color="primary" variant="contained" fullWidth>
        Sign up
      </Button>
    </MenuItem>
    <MenuItem>
      <Button component={RouterLink} to="/signin" color="primary" variant="outlined" fullWidth>
        Sign in
      </Button>
    </MenuItem> */}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
