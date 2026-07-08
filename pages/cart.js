import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Alert,
  Button,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy:', err);
      alert('Failed to copy link. Please try again.');
    });
  };

  const handleCloseDialog = () => {
    setShareDialogOpen(false);
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h3">My Cart</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleShareClick}
          disabled={currentCartItems.length === 0}
        >
          Share Cart
        </Button>
      </Stack>

      {sharedCart && (
        <Alert severity="info" sx={{ mb: 2 }}>
          ✓ You are viewing a shared cart snapshot. Items cannot be modified.
        </Alert>
      )}

      <CartItemList sharedCart={sharedCart} onCartItemsChange={setCurrentCartItems} />

      <Dialog open={shareDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Share Your Cart</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Share this link with others to show them your cart:
            </Typography>
            <TextField
              fullWidth
              value={shareLink}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                    <IconButton onClick={handleCopyLink} size="small" edge="end">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleCopyLink} variant="contained" color="primary">
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Cart;

              
              
            