import React from 'react';
import Link from 'next/link';
import { Container, Typography, Button, Stack } from '@mui/material';
import WishlistItemList from '../components/WishlistItemList';

function WishlistPage() {
  return (
    <Container sx={{ pt: 4 }}>
      <Typography variant="h3">My Wishlist</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Link href="/shop" passHref>
          <Button variant="contained">View shop</Button>
        </Link>
        <Link href="/cart" passHref>
          <Button variant="contained">View Cart</Button>
        </Link>
      </Stack>

      <WishlistItemList />
    </Container>
  );
}

export default WishlistPage;
