import React from 'react';
import Link from 'next/link';
import { Container, Typography } from '@mui/material';
import WishlistItemList from '../components/WishlistItemList';

function WishlistPage() {
  return (
    <Container>
      <Typography variant="h3">My Wishlist</Typography>

      <div>
        <Link href="/shop">Back to shop</Link>
      </div>

      <div>
        <Link href="/cart">View Cart</Link>
      </div>

      <WishlistItemList />
    </Container>
  );
}

export default WishlistPage;