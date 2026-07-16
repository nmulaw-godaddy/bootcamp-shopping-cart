import React, { useState, useEffect } from 'react';
import Head from '../components/head';
import ShopItemList from '../components/ShopItemList';
import ShoppingChatbot from '../components/ShoppingChatbot';
import LoginDoughnut from '../components/LoginDoughnut';
import { Container } from '@mui/material';

export default function ShopPage() {
  const [showDoughnut, setShowDoughnut] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('justLoggedIn')) {
      sessionStorage.removeItem('justLoggedIn');
      setShowDoughnut(true);
      const timer = setTimeout(() => setShowDoughnut(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Container sx={{ pt: 2 }}>
      {showDoughnut && <LoginDoughnut />}
      <Head title="Shop" />
      <ShopItemList />
      <ShoppingChatbot />
    </Container>
  );
}
