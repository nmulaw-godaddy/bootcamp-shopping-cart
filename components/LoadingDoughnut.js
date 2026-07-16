import doughmainLogo from '../images/doughmains.png';
import Box from '@mui/material/Box';

export default function LoadingDoughnut({ size = 100 }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
      <Box
        component="img"
        src={doughmainLogo.src}
        alt="Loading..."
        sx={{
          width: size,
          height: size,
          objectFit: 'contain',
          animation: 'spin 3s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />
    </Box>
  );
}
