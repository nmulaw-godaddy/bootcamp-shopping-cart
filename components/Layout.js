import React from 'react';
import { Box } from '@mui/material';
import NavBar from './NavBar';
import Footer from './Footer';

const SPRINKLES = [
  { x: 3, y: 8, color: '#FF5C93', rotate: -30, w: 34, h: 10 },
  { x: 8, y: 22, color: '#FFD166', rotate: 45, w: 30, h: 9 },
  { x: 15, y: 5, color: '#7ED6FF', rotate: 15, w: 36, h: 10 },
  { x: 22, y: 40, color: '#C792EA', rotate: -50, w: 28, h: 9 },
  { x: 30, y: 15, color: '#A8E6CF', rotate: 70, w: 34, h: 10 },
  { x: 38, y: 60, color: '#FF8AAE', rotate: -20, w: 30, h: 9 },
  { x: 45, y: 10, color: '#FFD166', rotate: 55, w: 36, h: 10 },
  { x: 52, y: 35, color: '#7ED6FF', rotate: -40, w: 28, h: 9 },
  { x: 60, y: 75, color: '#FFC6D9', rotate: 25, w: 34, h: 10 },
  { x: 67, y: 18, color: '#C792EA', rotate: -65, w: 30, h: 9 },
  { x: 73, y: 50, color: '#A8E6CF', rotate: 35, w: 36, h: 10 },
  { x: 80, y: 28, color: '#FF5C93', rotate: -15, w: 28, h: 9 },
  { x: 86, y: 65, color: '#FFD166', rotate: 80, w: 34, h: 10 },
  { x: 92, y: 12, color: '#7ED6FF', rotate: -45, w: 30, h: 9 },
  { x: 97, y: 45, color: '#FFC6D9', rotate: 60, w: 36, h: 10 },
  { x: 5, y: 55, color: '#A8E6CF', rotate: -25, w: 30, h: 9 },
  { x: 12, y: 80, color: '#C792EA', rotate: 50, w: 28, h: 9 },
  { x: 25, y: 90, color: '#FFD166', rotate: -70, w: 34, h: 10 },
  { x: 48, y: 88, color: '#FF8AAE', rotate: 40, w: 30, h: 9 },
  { x: 70, y: 92, color: '#7ED6FF', rotate: -55, w: 36, h: 10 },
  { x: 85, y: 85, color: '#FFC6D9', rotate: 30, w: 28, h: 9 },
  { x: 95, y: 72, color: '#A8E6CF', rotate: -35, w: 34, h: 10 },
  { x: 18, y: 65, color: '#FFD166', rotate: 65, w: 30, h: 9 },
  { x: 55, y: 55, color: '#C792EA', rotate: -10, w: 28, h: 9 },
  { x: 78, y: 38, color: '#FF5C93', rotate: 75, w: 36, h: 10 },
  { x: 35, y: 78, color: '#7ED6FF', rotate: -60, w: 30, h: 9 },
  { x: 62, y: 5, color: '#A8E6CF', rotate: 20, w: 28, h: 9 },
  { x: 90, y: 30, color: '#FFD166', rotate: -80, w: 34, h: 10 },
  { x: 42, y: 28, color: '#FF8AAE', rotate: 30, w: 32, h: 9 },
  { x: 10, y: 44, color: '#7ED6FF', rotate: -55, w: 28, h: 9 },
  { x: 58, y: 20, color: '#FFD166', rotate: 50, w: 36, h: 10 },
  { x: 76, y: 10, color: '#C792EA', rotate: -25, w: 30, h: 9 },
  { x: 28, y: 52, color: '#FF5C93', rotate: 15, w: 34, h: 10 },
  { x: 65, y: 42, color: '#A8E6CF', rotate: -40, w: 28, h: 9 },
  { x: 40, y: 70, color: '#FFC6D9', rotate: 70, w: 32, h: 9 },
  { x: 88, y: 52, color: '#FF8AAE', rotate: -30, w: 30, h: 9 },
];

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: '#FFEDF5' }}>
      {/* Sprinkle background layer */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {SPRINKLES.map((s, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.w,
              height: s.h,
              borderRadius: 999,
              backgroundColor: s.color,
              transform: `rotate(${s.rotate}deg)`,
              opacity: 0.72,
            }}
          />
        ))}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <NavBar />
      </Box>

      <Box component="main" sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {children}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </Box>
    </Box>
  );
}
