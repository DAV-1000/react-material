
import React from "react";
import { Box, Typography } from "@mui/material";  
export default function Features() {
  return (


    
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Features
        </Typography>
        <Typography>
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit...
        </Typography>
      </div>
    </Box>
  );
}
