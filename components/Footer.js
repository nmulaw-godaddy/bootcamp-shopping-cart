import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, Divider } from '@mui/material';
import Link from 'next/link';
import doughmainLogo from '../images/doughmains.png';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/our-story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Benefits', href: '/benefits' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Services', href: '/services' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Legal', href: '/legal' },
    ],
  },
];

const FrostingWave = () => (
  <Box
    aria-hidden="true"
    sx={{ lineHeight: 0, display: 'block', mb: '-2px', overflow: 'hidden' }}
  >
    <svg
      viewBox="0 0 1440 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: 80 }}
    >
      <path
        d="M0 40 C120 10, 240 70, 360 40 C480 10, 600 70, 720 40 C840 10, 960 70, 1080 40 C1200 10, 1320 70, 1440 40 L1440 80 L0 80 Z"
        fill="#FFF0F6"
      />
    </svg>
  </Box>
);

const DonutDecor = () => (
  <Box
    component="img"
    src={doughmainLogo.src}
    alt=""
    aria-hidden="true"
    sx={{ width: 52, height: 52, objectFit: 'contain' }}
  />
);

export default function Footer() {
  return (
    <Box component="footer">
      <FrostingWave />
      <Box sx={{ backgroundColor: '#FFF0F6', borderTop: '1px solid #F5CEDC', pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="flex-start">
            {/* Brand column */}
            <Grid item xs={12} sm={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <DonutDecor />
                <Typography variant="h6" sx={{ color: '#FF5C93', fontSize: '1.25rem', fontFamily: '"Satisfy", cursive', letterSpacing: '0.03em', textShadow: '0 1px 0 rgba(185,28,65,0.2)' }}>
                  Doughmains
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#7A6A61', lineHeight: 1.7, maxWidth: 220 }}>
                Sweet products to keep your business running — powered by the finest digital bakery.
              </Typography>
            </Grid>

            {/* Link columns */}
            {COLUMNS.map(({ heading, links }) => (
              <Grid item xs={6} sm={4} md={3} key={heading}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: '#432818', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}
                >
                  {heading}
                </Typography>
                {links.map(({ label, href }) => (
                  <Link key={href} href={href} passHref legacyBehavior>
                    <MuiLink
                      sx={{
                        display: 'block',
                        mb: 0.75,
                        color: '#7A6A61',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontFamily: '"Poppins", sans-serif',
                        transition: 'color 0.15s',
                        '&:hover': { color: '#FF5C93', textDecoration: 'none' },
                      }}
                    >
                      {label}
                    </MuiLink>
                  </Link>
                ))}
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mt: 4, mb: 3, borderColor: '#F5CEDC' }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#7A6A61' }}>
              © {new Date().getFullYear()} Doughmains. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
