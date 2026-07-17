import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, Box, Alert, Chip } from '@mui/material';
import Link from 'next/link';
import CartItem from './CartItem';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

function CartItemList({ sharedCart, onCartItemsChange }) {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [availableCodes, setAvailableCodes] = useState([]);

  useEffect(() => {
    if (sharedCart) {
      setCartItems(Array.isArray(sharedCart) ? sharedCart : []);
      return;
    }

    const getCartItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/cartitems');
        const json = await response.json();
        const items = Array.isArray(json) ? json : [];
        setCartItems(items);
        if (onCartItemsChange) onCartItemsChange(items);
      } catch {
        // silently ignore
      }
    };

    const getPromoCodes = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/promocodes');
        const json = await response.json();
        setAvailableCodes(Array.isArray(json) ? json : []);
      } catch {
        // silently ignore
      }
    };

    getCartItems();
    getPromoCodes();
  }, [sharedCart]);

  const updateCartItemQuantity = async (id, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/cartitems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        const updated = cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updated);
        if (onCartItemsChange) onCartItemsChange(updated);
      } else {
        const json = await response.json();
        alert(json.message || 'Failed to update quantity.');
      }
    } catch {
      // silently ignore
    }
  };

  const deleteCartItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/cartitems/${id}`, { method: 'DELETE' });
      if (response.ok) {
        const updated = cartItems.filter((item) => item.id !== id);
        setCartItems(updated);
        if (onCartItemsChange) onCartItemsChange(updated);
      } else {
        alert(`Failed to delete item ${id}. Status: ${response.status}`);
      }
    } catch {
      // silently ignore
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    try {
      const subtotal = cartItems.reduce((a, item) => {
        return a + (Number(item.is_on_sale ? item.sale_price : item.price) * Number(item.quantity || 1));
      }, 0);

      const response = await fetch('http://localhost:8000/v1/promocodes/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.toUpperCase(), cart_total: subtotal }),
      });

      if (response.ok) {
        const result = await response.json();
        setAppliedPromo(result);
        setPromoError('');
      } else {
        const error = await response.json();
        setPromoError(error.error || 'Invalid promo code');
        setAppliedPromo(null);
      }
    } catch {
      setPromoError('Failed to apply promo code');
      setAppliedPromo(null);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const subtotal = cartItems.reduce((a, item) => {
    return a + (Number(item.is_on_sale ? item.sale_price : item.price) * Number(item.quantity || 1));
  }, 0);

  const discountAmount = appliedPromo ? appliedPromo.discount_amount : 0;
  const totalPrice = appliedPromo ? appliedPromo.final_total : subtotal;

  if (cartItems.length === 0 && !sharedCart) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#432818', mb: 1 }}>Your cart is empty</Typography>
        <Typography variant="body2" sx={{ color: '#7A6A61', mb: 3 }}>
          Add some delicious products to get started!
        </Typography>
        <Link href="/shop" passHref>
          <Button variant="contained" size="large" sx={{ borderRadius: 999 }}>
            Browse Products
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {/* Left: cart items */}
      <Grid item xs={12} md={7}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              product_id={item.product_id}
              name={item.name}
              description={item.description}
              image_url={item.image_url}
              price={item.price}
              is_on_sale={item.is_on_sale}
              sale_price={item.sale_price}
              quantity={item.quantity || 1}
              onQuantityChange={(newQty) => updateCartItemQuantity(item.id, newQty)}
              onDeleteItem={() => deleteCartItem(item.id)}
            />
          ))}

          {/* Continue shopping link */}
          <Box sx={{ mt: 1 }}>
            <Link href="/shop" passHref>
              <Button
                variant="outlined"
                sx={{ borderRadius: 999, color: '#FF5C93', borderColor: '#F5CEDC' }}
              >
                ← Continue Shopping
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>

      {/* Right: order summary */}
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #F5CEDC',
            borderRadius: '20px',
            p: 3,
            boxShadow: '0 8px 24px rgba(255,92,147,0.08)',
            position: { md: 'sticky' },
            top: { md: 80 },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#432818', mb: 2.5 }}>
            Order Summary
          </Typography>

          {/* Promo code */}
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
              <LocalOfferIcon sx={{ fontSize: 16, color: '#FF5C93' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#432818' }}>Promo Code</Typography>
            </Box>

            {appliedPromo ? (
              <Alert
                severity="success"
                onClose={removePromoCode}
                sx={{ borderRadius: 12, py: 0.75, fontSize: '0.8rem' }}
              >
                <strong>{appliedPromo.promo_code.code}</strong> applied!
                {appliedPromo.promo_code.description && ` — ${appliedPromo.promo_code.description}`}
              </Alert>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Enter promo code"
                    variant="outlined"
                    size="small"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    error={!!promoError}
                    helperText={promoError}
                    sx={{ flex: 1 }}
                    inputProps={{ 'aria-label': 'promo code input' }}
                  />
                  <Button
                    variant="contained"
                    onClick={applyPromoCode}
                    disabled={!promoCode.trim()}
                    sx={{ borderRadius: 12, px: 2, flexShrink: 0, fontWeight: 700 }}
                  >
                    Apply
                  </Button>
                </Box>

                {availableCodes.length > 0 && (
                  <Box sx={{ mt: 1.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {availableCodes.map((code) => (
                      <Chip
                        key={code.id}
                        label={`${code.code} (${code.discount_percent}% off)`}
                        size="small"
                        onClick={() => setPromoCode(code.code)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: '#FFF0F6',
                          color: '#FF5C93',
                          border: '1px solid #F5CEDC',
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          height: 22,
                          borderRadius: 999,
                          '&:hover': { backgroundColor: '#FFC6D9' },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Totals */}
          <Box sx={{ borderTop: '1.5px solid #F5CEDC', pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#7A6A61' }}>Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#432818' }}>${subtotal.toFixed(2)}</Typography>
            </Box>

            {appliedPromo && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#2D6A4F' }}>
                  Discount ({appliedPromo.promo_code.discount_percent}%)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D6A4F' }}>
                  −${discountAmount.toFixed(2)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, borderTop: '1.5px solid #F5CEDC', mt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#432818' }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF5C93' }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Checkout button */}
          <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Link href="/checkout" passHref>
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={cartItems.length === 0}
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 12, py: 1.4, fontWeight: 700, fontSize: '0.95rem' }}
              >
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/shop" passHref>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ShoppingBagIcon />}
                sx={{ borderRadius: 12, py: 1.1, borderColor: '#F5CEDC', color: '#FF5C93', fontWeight: 600 }}
              >
                Continue Shopping
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default CartItemList;
