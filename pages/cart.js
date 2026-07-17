import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, IconButton, Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import Head from '../components/head';
import CartItemList from '../components/CartItemList';
import { createCartShareUrl, decodeSharedCart } from '../components/CartShare';

function Cart() {
  const [sharedCart, setSharedCart] = useState(null);
  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sharedPayload = decodeSharedCart(window.location.search);
    setSharedCart(sharedPayload);
  }, []);

  const handleShareClick = () => {
    if (currentCartItems.length === 0) {
      alert('Your cart is empty. Add items before sharing.');
      return;
    }
    const cartItems = sharedCart || currentCartItems;
    const link = createCartShareUrl(cartItems, window.location.origin);
    setShareLink(link);
    setShareDialogOpen(true);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const el = document.createElement('textarea');
    el.value = shareLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>
      <Head title="My Cart" />

      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#432818', fontSize: { xs: '1.6rem', md: '2rem' } }}>
            My Cart
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<IosShareIcon />}
          onClick={handleShareClick}
          disabled={currentCartItems.length === 0}
          sx={{ borderRadius: 999, borderColor: '#F5CEDC', color: '#FF5C93', fontWeight: 600, px: 2.5 }}
        >
          Share Cart
        </Button>
      </Box>

      {sharedCart && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 12 }}>
          You are viewing a shared cart snapshot. Items cannot be modified.
        </Alert>
      )}

      <CartItemList sharedCart={sharedCart} onCartItemsChange={setCurrentCartItems} />

      {/* Share cart dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#432818' }}>
          Share Your Cart
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {copied && (
              <Alert severity="success" sx={{ borderRadius: 12, py: 0.5 }}>
                Link copied to clipboard!
              </Alert>
            )}
            <Typography variant="body2" sx={{ color: '#7A6A61' }}>
              Share this link with others to show them your cart:
            </Typography>
            <TextField
              fullWidth
              value={shareLink}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                    <IconButton onClick={handleCopyLink} size="small" edge="end" aria-label="copy share link">
                      <ContentCopyIcon sx={{ fontSize: 18, color: copied ? '#2D6A4F' : '#FF5C93' }} />
                    </IconButton>
                  </Tooltip>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShareDialogOpen(false)} sx={{ color: '#7A6A61' }}>Close</Button>
          <Button
            onClick={handleCopyLink}
            variant="contained"
            sx={{ borderRadius: 999, px: 3 }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Cart;
