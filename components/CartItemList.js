import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, Box, Alert, Chip } from '@mui/material';
import CartItem from './CartItem';

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

        console.log('Cart items from API:', json);

        setCartItems(Array.isArray(json) ? json : []);
        if (onCartItemsChange) {
          onCartItemsChange(json);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    const getPromoCodes = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/promocodes');
        const json = await response.json();
        setAvailableCodes(Array.isArray(json) ? json : []);
      } catch (error) {
        console.error('Error fetching promo codes:', error);
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
        setCartItems(cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        const json = await response.json();
        alert(json.message || 'Failed to update quantity.');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const deleteCartItem = async (id) => {
    try {
      console.log('Deleting cart item id:', id);

      const response = await fetch(`http://localhost:8000/v1/cartitems/${id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        const newItems = cartItems.filter((item) => item.id !== id);
        setCartItems(newItems);
      } else {
        alert(`Failed to delete item ${id}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      const subtotal = (Array.isArray(cartItems) ? cartItems : [])
        .map((item) => {
          const itemPrice = Number(item.is_on_sale ? item.sale_price : item.price);
          const quantity = Number(item.quantity || 1);
          return quantity * itemPrice;
        })
        .reduce((a, b) => a + b, 0);

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
    } catch (error) {
      console.error('Error applying promo code:', error);
      setPromoError('Failed to apply promo code');
      setAppliedPromo(null);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const subtotal = (Array.isArray(cartItems) ? cartItems : [])
    .map((item) => {
      const itemPrice = Number(item.is_on_sale ? item.sale_price : item.price);
      const quantity = Number(item.quantity || 1);
      return quantity * itemPrice;
    })
    .reduce((a, b) => a + b, 0);

  const totalPrice = appliedPromo ? appliedPromo.final_total : subtotal;

  return (
    <div>
      <Grid container direction="column" spacing={3}>
        {(Array.isArray(cartItems) ? cartItems : []).map((item) => (
          <Grid item xs={6} key={item.id}>
            <CartItem
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
          </Grid>
        ))}
      </Grid>

      <Box sx={{ paddingTop: '30px', maxWidth: '500px' }}>
        <Typography variant="h5" gutterBottom>
          Promo Code
        </Typography>

        {appliedPromo ? (
          <Box sx={{ marginBottom: 2 }}>
            <Alert
              severity="success"
              onClose={removePromoCode}
              sx={{ marginBottom: 2 }}
            >
              <strong>{appliedPromo.promo_code.code}</strong> applied!
              {appliedPromo.promo_code.description && ` - ${appliedPromo.promo_code.description}`}
            </Alert>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
              <TextField
                label="Enter promo code"
                variant="outlined"
                size="small"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                error={!!promoError}
                helperText={promoError}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={applyPromoCode}
                disabled={!promoCode.trim()}
                sx={{
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                Apply
              </Button>
            </Box>
            {availableCodes.length > 0 && (
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Available codes:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginTop: 0.5 }}>
                  {availableCodes.map((code) => (
                    <Chip
                      key={code.id}
                      label={`${code.code} (${code.discount_percent}% off)`}
                      size="small"
                      onClick={() => setPromoCode(code.code)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}

        <Box sx={{ paddingTop: '20px', borderTop: '2px solid #ddd' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
            <Typography variant="h6">Subtotal:</Typography>
            <Typography variant="h6">${subtotal.toFixed(2)}</Typography>
          </Box>

          {appliedPromo && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1, color: 'green' }}>
              <Typography>
                Discount ({appliedPromo.promo_code.discount_percent}%):
              </Typography>
              <Typography>-${appliedPromo.discount_amount.toFixed(2)}</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, paddingTop: 2, borderTop: '1px solid #ddd' }}>
            <Typography variant="h4">Total:</Typography>
            <Typography variant="h4" color={appliedPromo ? 'primary' : 'text.primary'}>
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default CartItemList;
  
