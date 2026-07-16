import { keyframes } from '@emotion/react';
import doughmainLogo from '../images/doughmains.png';
import Box from '@mui/material/Box';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export default function LoginDoughnut({ size = 200 }) {
  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      pointerEvents: 'none',
    }}>
      <Box
        component="img"
        src={doughmainLogo.src}
        alt=""
        sx={{
          width: size,
          height: size,
          objectFit: 'contain',
          transformOrigin: 'center center',
          animation: `${spin} 3s linear 1 forwards`,
        }}
      />
    </Box>
  );
}
