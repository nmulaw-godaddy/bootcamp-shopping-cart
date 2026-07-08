import React from 'react';
import { Container, Typography } from '@mui/material';
import CartItemList from '../components/CartItemList';
import ShoppingChatbot from '../components/ShoppingChatbot';

function Cart() {
  return (
    <Container>
      <Typography variant="h3">My Cart</Typography>

      <ShoppingChatbot />

      <CartItemList />
    </Container>
  );
}

export default Cart;
              
              
            