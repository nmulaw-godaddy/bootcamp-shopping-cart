import React from 'react';
import Link from 'next/link';
import { Contianer, Typography } from '@mui/material';
import WishlistItemList from '../components/WishlistItemList';

function WishlistPage() {
  return (
    <Contianer>
      <Typography variant="h3">My Wishlist</Typography>

      <div>
        <Link href="/shop">Back to shop </Link>
      </div>

      <div>
        <Link href="/cart">View Cart</Link>
      </div>

      <WishlistItemList />
    </Contianer>
  );
}

export default WishlistPage;