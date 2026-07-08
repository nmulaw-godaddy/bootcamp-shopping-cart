import React from 'react';
import Head from '../components/head';
import ShopItemList from '../components/ShopItemList';
import { Container } from '@mui/material';

export const ShopPage = () => (
  <Container sx={{ pt: 2 }}>
    <Head title="Shop" />
    <ShopItemList />
  </Container>
);

export default ShopPage;
