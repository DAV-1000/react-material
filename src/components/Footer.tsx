import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";
import SitemarkIcon from "../components/SitemarkIcon";
import EmailSubscribe from "../components/EmailSubscribe";

import { Link as RouterLink } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
      {"Copyright © "}
      <Link color="text.secondary" href="https://mui.com/">
        Sitemark
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}



export default function Footer() {

  const handleEmailSubscribe = (email: string) => {
    // Replace with your API call or subscription logic
    alert(`Subscribed with: ${email}`);
  };

  return (
    <React.Fragment>
      <Divider />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 4, sm: 8 },
          py: { xs: 8, sm: 10 },
          textAlign: { sm: "center", md: "left" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: { xs: "100%", sm: "60%" },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
              <SitemarkIcon />
              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: 600, mt: 2 }}
              >
                Join the newsletter
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                Subscribe for weekly updates. No spams ever!
              </Typography>
              <EmailSubscribe onSubscribe={handleEmailSubscribe} />

            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              Product
            </Typography>
            <Link
              component={RouterLink}
              to="/features"
              color="text.secondary"
              variant="body2"
            >
              Features
            </Link>
            <Link
              component={RouterLink}
              to="/testimonials"
              color="text.secondary"
              variant="body2"
            >
              Testimonials
            </Link>
            <Link
              component={RouterLink}
              to="/highlights"
              color="text.secondary"
              variant="body2"
            >
              Highlights
            </Link>
            <Link
              component={RouterLink}
              to="/pricing"
              color="text.secondary"
              variant="body2"
            >
              Pricing
            </Link>
            <Link
              component={RouterLink}
              to="/faq"
              color="text.secondary"
              variant="body2"
            >
              FAQs
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              Company
            </Typography>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              variant="body2"
            >
              About us
            </Link>
            <Link
              component={RouterLink}
              to="/careers"
              color="text.secondary"
              variant="body2"
            >
              Careers
            </Link>
            <Link
              component={RouterLink}
              to="/press"
              color="text.secondary"
              variant="body2"
            >
              Press
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              Legal
            </Typography>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              variant="body2"
            >
              Terms
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              variant="body2"
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              variant="body2"
            >
              Contact
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: { xs: 4, sm: 8 },
            width: "100%",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <div>
            <Link color="text.secondary" variant="body2" href="#">
              Privacy Policy
            </Link>
            <Typography sx={{ display: "inline", mx: 0.5, opacity: 0.5 }}>
              &nbsp;•&nbsp;
            </Typography>
            <Link color="text.secondary" variant="body2" href="#">
              Terms of Service
            </Link>
            <Copyright />
          </div>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ justifyContent: "left", color: "text.secondary" }}
          >
            <IconButton
              color="inherit"
              size="small"
              href="https://github.com/mui"
              aria-label="GitHub"
              sx={{ alignSelf: "center" }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              href="https://x.com/MaterialUI"
              aria-label="X"
              sx={{ alignSelf: "center" }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              href="https://www.linkedin.com/company/mui/"
              aria-label="LinkedIn"
              sx={{ alignSelf: "center" }}
            >
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
}
