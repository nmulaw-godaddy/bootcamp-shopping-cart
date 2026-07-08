import React from 'react';
import Head from '../components/head';
import ShopItemList from '../components/ShopItemList';
import ShoppingChatbot from '../components/ShoppingChatbot';
import { Container } from '@mui/material';

export const ShopPage = () => (
  <Container sx={{ pt: 2 }}>
    <Head title="Shop" />
    <ShopItemList />

    <ShoppingChatbot />
  </Container>
);

export default ShopPage;
