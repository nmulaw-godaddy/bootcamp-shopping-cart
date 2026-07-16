import { keyframes } from '@emotion/react';
import doughmainLogo from '../images/doughmains.png';
import Box from '@mui/material/Box';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

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
          animation: `${spin} 3s linear 1 forwards`,
          transformOrigin: 'center center',
        }}
      />
    </Box>
  );
}
