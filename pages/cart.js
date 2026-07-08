import React, { useEffect, useState } from 'react';
import { Container, Typography, Alert, Button, Stack, Box } from '@mui/material';
import Link from 'next/link';
import CartItemList from '../components/CartItemList';
import { createCartShareUrl, decodeSharedCart } from '../utils/cartShare';

function Cart() {
  const [sharedCart, setSharedCart] = useState(null);
  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sharedPayload = decodeSharedCart(window.location.search);
    setSharedCart(sharedPayload);
  }, []);

  const handleShare = () => {
    const cartItems = sharedCart || currentCartItems;
    const link = createCartShareUrl(cartItems, window.location.origin);
    setShareLink(link);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h3">My Cart</Typography>
        <Button variant="contained" onClick={handleShare}>
          {copied ? 'Link copied!' : 'Share cart'}
        </Button>
      </Stack>

      {sharedCart && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You are viewing a shared cart snapshot.
        </Alert>
      )}

      {shareLink && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Share link:</Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{shareLink}</Typography>
        </Box>
      )}

      <Link href="/shop" passHref>
          <Button variant="contained">View shop</Button>
      </Link>

      <CartItemList sharedCart={sharedCart} onCartItemsChange={setCurrentCartItems} />

    </Container>
  );
}

export default Cart;
              
              
            