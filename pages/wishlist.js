import React from 'react';
import Link from 'next/link';
import { Container, Typography, Button, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Head from '../components/head';
import WishlistItemList from '../components/WishlistItemList';

function WishlistPage() {
  return (
    <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>
      <Head title="My Wishlist" />

      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FavoriteIcon sx={{ color: '#FF5C93', fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#432818', fontSize: { xs: '1.6rem', md: '2rem' } }}>
            My Wishlist
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Link href="/shop" passHref>
            <Button
              variant="contained"
              startIcon={<StorefrontIcon />}
              sx={{ borderRadius: 999, fontWeight: 600, fontSize: '0.85rem', px: 2 }}
            >
              View Shop
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button
              variant="contained"
              startIcon={<ShoppingCartOutlinedIcon />}
              sx={{ borderRadius: 999, fontWeight: 600, fontSize: '0.85rem', px: 2 }}
            >
              View Cart
            </Button>
          </Link>
        </Box>
      </Box>

      <WishlistItemList />
    </Container>
  );
}

export default WishlistPage;
