import React from 'react';
import Head from '../components/head';
import Link from 'next/link';

import ShopItemList from '../components/ShopItemList';
import { Container, Typography } from '@mui/material';

export const ShopPage = () => (
  <Container>
    <Head title="Home" />

    <Typography variant="h3">My Shop</Typography>

    <div>
      <Link href="/cart">View cart</Link>
    </div>

    <ShopItemList />
  </Container>
);

export default ShopPage;
