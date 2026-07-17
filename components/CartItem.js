import React, { useState } from 'react';
import {
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getImageUrl } from './ShopItem';

function CartItem({ product_id, name, description, image_url, price, is_on_sale, sale_price, quantity, onQuantityChange, onDeleteItem }) {
  const displayImage = getImageUrl(product_id, image_url);
  const itemPrice = Number(price);
  const itemQuantity = Number(quantity || 1);
  const subtotal = itemPrice * itemQuantity;

  const discountPercent = is_on_sale && price && sale_price
    ? Math.round(((price - sale_price) / price) * 100)
    : 0;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeQty, setRemoveQty] = useState(1);

  const handleRemoveClick = () => {
    if (itemQuantity > 1) {
      setRemoveQty(1);
      setDialogOpen(true);
    } else {
      onDeleteItem();
    }
  };

  const handleRemoveAll = () => {
    onDeleteItem();
    setDialogOpen(false);
  };

  const handleRemovePartial = () => {
    const newQty = itemQuantity - removeQty;
    if (newQty <= 0) {
      onDeleteItem();
    } else {
      onQuantityChange(newQty);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: { xs: 2, sm: 2.5 },
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #F5CEDC',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(255,92,147,0.06)',
          position: 'relative',
          transition: 'box-shadow 0.2s ease',
          '&:hover': { boxShadow: '0 6px 20px rgba(255,92,147,0.12)' },
        }}
      >
        {/* Product image */}
        {displayImage && (
          <Box
            sx={{
              width: { xs: 72, sm: 90 },
              height: { xs: 72, sm: 90 },
              flexShrink: 0,
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #F5CEDC',
            }}
          >
            <Box
              component="img"
              src={displayImage}
              alt={name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}

        {/* Product info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#432818', lineHeight: 1.3 }}>
                  {name}
                </Typography>
                {is_on_sale && (
                  <Chip
                    label={`${discountPercent}% OFF`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      backgroundColor: '#FF5C93',
                      color: '#fff',
                      borderRadius: 999,
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#7A6A61',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  mt: 0.25,
                }}
              >
                {description}
              </Typography>
            </Box>

            {/* Remove button */}
            <IconButton
              size="small"
              onClick={handleRemoveClick}
              aria-label={`remove ${name} from cart`}
              sx={{
                color: '#FF5C93',
                flexShrink: 0,
                '&:hover': { backgroundColor: '#FFF0F6' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Price + qty row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            {/* Quantity stepper */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onQuantityChange(itemQuantity - 1)}
                disabled={itemQuantity <= 1}
                sx={{
                  minWidth: 28, width: 28, height: 28, p: 0, borderRadius: 999,
                  borderColor: '#F5CEDC', color: '#FF5C93', fontSize: '0.9rem',
                  '&:hover': { borderColor: '#FF5C93', backgroundColor: 'rgba(255,92,147,0.04)' },
                }}
                aria-label="decrease quantity"
              >
                −
              </Button>
              <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center', fontWeight: 700, color: '#432818' }}>
                {itemQuantity}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onQuantityChange(itemQuantity + 1)}
                sx={{
                  minWidth: 28, width: 28, height: 28, p: 0, borderRadius: 999,
                  borderColor: '#F5CEDC', color: '#FF5C93', fontSize: '0.9rem',
                  '&:hover': { borderColor: '#FF5C93', backgroundColor: 'rgba(255,92,147,0.04)' },
                }}
                aria-label="increase quantity"
              >
                +
              </Button>
            </Box>

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {is_on_sale && (
                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#7A6A61' }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              )}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF5C93' }}>
                ${(itemPrice * itemQuantity).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Remove quantity dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#432818' }}>Remove {name}?</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Button
              variant="contained"
              onClick={handleRemoveAll}
              fullWidth
              sx={{ background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)', color: '#fff' }}
            >
              Remove All ({itemQuantity})
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => setRemoveQty((q) => Math.max(1, q - 1))} disabled={removeQty <= 1} sx={{ minWidth: 32, width: 32, height: 32, p: 0, borderRadius: 999, borderColor: '#F5CEDC', color: '#FF5C93' }}>−</Button>
              <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{removeQty}</Typography>
              <Button size="small" variant="outlined" onClick={() => setRemoveQty((q) => Math.min(itemQuantity - 1, q + 1))} disabled={removeQty >= itemQuantity - 1} sx={{ minWidth: 32, width: 32, height: 32, p: 0, borderRadius: 999, borderColor: '#F5CEDC', color: '#FF5C93' }}>+</Button>
              <Button variant="outlined" onClick={handleRemovePartial} sx={{ ml: 1, borderColor: '#F5CEDC', color: '#FF5C93' }}>
                Remove {removeQty}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#7A6A61' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CartItem;
