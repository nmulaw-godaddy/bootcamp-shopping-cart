import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Typography, Button, CardMedia, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip,
} from '@mui/material';
import { getImageUrl } from './ShopItem';

function CartItem({ product_id, name, description, image_url, price, is_on_sale, sale_price, quantity, onQuantityChange, onDeleteItem }) {

  const displayImage = getImageUrl(product_id, image_url);

  const itemPrice = Number(is_on_sale ? sale_price : price);
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
      <Card style={{ minHeight: '400px', position: 'relative' }}>
        {is_on_sale && (
          <Chip
            label={`${discountPercent}% OFF`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              fontWeight: 'bold'
            }}
          />
        )}
        {displayImage && (
          <CardMedia
            component="img"
            height="200"
            image={displayImage}
            alt={name}
          />
        )}

        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 1 }}>
            <Typography variant="body2">Price:</Typography>
            {is_on_sale ? (
              <>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  ${Number(price).toFixed(2)}
                </Typography>
                <Typography variant="body1" color="error" sx={{ fontWeight: 'bold' }}>
                  ${itemPrice.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="body1">
                ${itemPrice.toFixed(2)}
              </Typography>
            )}
          </Box>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onQuantityChange(itemQuantity - 1)}
              disabled={itemQuantity <= 1}
            >−</Button>
            <Typography variant="body1">{itemQuantity}</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onQuantityChange(itemQuantity + 1)}
            >+</Button>
          </div>
        </CardContent>

        <CardActions>
          <Button variant="contained" color="error" onClick={handleRemoveClick}>
            Remove
          </Button>
        </CardActions>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Remove {name}?</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Button variant="contained" color="error" onClick={handleRemoveAll} fullWidth>
              Remove All ({itemQuantity})
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setRemoveQty((q) => Math.max(1, q - 1))}
                disabled={removeQty <= 1}
              >−</Button>
              <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center' }}>{removeQty}</Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setRemoveQty((q) => Math.min(itemQuantity - 1, q + 1))}
                disabled={removeQty >= itemQuantity - 1}
              >+</Button>
              <Button variant="outlined" color="error" onClick={handleRemovePartial}>
                Remove {removeQty}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CartItem;
