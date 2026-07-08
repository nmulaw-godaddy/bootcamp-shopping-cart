import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

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

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'grey.300', py: 6, mt: 'auto' }}>
      <Container>
        <Grid container spacing={4}>
          {COLUMNS.map(({ heading, links }) => (
            <Grid item xs={12} sm={4} key={heading}>
              <Typography variant="subtitle1" fontWeight={700} color="white" gutterBottom>
                {heading}
              </Typography>
              {links.map(({ label, href }) => (
                <Link key={href} href={href} passHref legacyBehavior>
                  <MuiLink
                    color="inherit"
                    display="block"
                    sx={{ mb: 0.5, textDecoration: 'none', '&:hover': { color: 'white' } }}
                  >
                    {label}
                  </MuiLink>
                </Link>
              ))}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
