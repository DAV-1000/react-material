
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';;


export default function Contact() {

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</Typography>
      </div>

    </Box>
  );
}
