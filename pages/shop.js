import React from 'react';
import Head from '../components/head';
import ShopItemList from '../components/ShopItemList';
import ShoppingChatbot from '../components/ShoppingChatbot';
import { Container, Box, Typography, Grid } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const FEATURES = [
  { icon: <SecurityIcon sx={{ fontSize: 28, color: '#FF5C93' }} />, title: 'Secure & Reliable', desc: 'Keep your business protected' },
  { icon: <GroupsIcon sx={{ fontSize: 28, color: '#FF5C93' }} />, title: 'Trusted by Thousands', desc: 'Join a growing community' },
  { icon: <SupportAgentIcon sx={{ fontSize: 28, color: '#FF5C93' }} />, title: '24/7 Support', desc: "We're here when you need us" },
];

export const ShopPage = () => (
  <Box>
    <Head title="Shop" />

    {/* Hero section */}
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 3, md: 5 }, textAlign: 'center' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#432818',
            fontSize: { xs: '2rem', md: '2.8rem' },
            mb: 1.5,
            lineHeight: 1.2,
          }}
        >
          Shop Doughmains
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#7A6A61', fontSize: { xs: '1rem', md: '1.1rem' } }}
        >
          Sweet products to keep your business running.
        </Typography>
      </Container>
    </Box>

    {/* Products grid */}
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      <ShopItemList />
    </Container>

    {/* Why Choose Doughmains section */}
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #F5CEDC',
          borderRadius: '24px',
          p: { xs: 3, md: 4 },
          boxShadow: '0 8px 24px rgba(255,92,147,0.08)',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: '#432818', mb: 3, textAlign: 'center' }}
        >
          Why Choose Doughmains?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {FEATURES.map(({ icon, title, desc }) => (
            <Grid item xs={12} sm={4} key={title}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#FFF0F6',
                    border: '1.5px solid #F5CEDC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#432818', mb: 0.25 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7A6A61' }}>
                    {desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>

    <ShoppingChatbot />
  </Box>
);

export default ShopPage;
