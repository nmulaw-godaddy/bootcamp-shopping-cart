import React from 'react';
import { Container, Typography } from '@mui/material';
import CartItemList from '../components/CartItemList';

function Cart() {
  return (
    <Container>
      <Typography variant="h3">My Cart</Typography>
      <CartItemList />
    </Container>
  );
}

export default Cart;

              
              
            