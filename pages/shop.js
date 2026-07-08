import React from 'react';
import Head from '../components/head';
import Link from 'next/link';

import ShopItemList from '../components/ShopItemList';
import { Container, Typography, Button } from '@mui/material';

export const ShopPage = () => (
  <Container>
    <Head title="Home" />

    <Typography variant="h3">My Shop</Typography>

    <Link href="/cart" passHref>                                  
          <Button variant="contained">View Cart</Button>              
    </Link>

    <ShopItemList />
  </Container>
);

export default ShopPage;
