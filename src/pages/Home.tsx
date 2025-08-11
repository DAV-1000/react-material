import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Link from "@mui/material/Link";

import { Link as RouterLink } from "react-router-dom";

export default function About() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Home
        </Typography>
        <Typography>
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit...
        </Typography>
        <Link
          component={RouterLink}
          to="/about"
          color="text.secondary"
          variant="body2"
        >
          About us
        </Link>
      </div>
    </Box>
  );
}
