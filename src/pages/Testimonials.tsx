
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';;


export default function Testimonials() {

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Testimonials
        </Typography>
        <Typography>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</Typography>
      </div>

    </Box>
  );
}
