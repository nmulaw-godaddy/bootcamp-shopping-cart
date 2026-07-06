import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';
import CartItemList from '../components/CartItemList';

function Cart() {
  return (
    <Container>
      <Typography variant="h3">My Cart</Typography>
        <Link href="/shop" passHref>                                  
          <Button variant="contained">View shop</Button>              
        </Link>
      <CartItemList />
    </Container>
  );
}

export default Cart;

              
              
            