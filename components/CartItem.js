import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia } from '@mui/material'
import { getImageUrl } from './ShopItem';

function CartItem({ product_id, name, description, image_url, price, is_on_sale, sale_price, quantity, onQuantityChange, onDeleteItem }) {

  const displayImage = getImageUrl(product_id, image_url);

  const itemPrice = Number(is_on_sale ? sale_price : price);
  const itemQuantity = Number(quantity || 1);
  const subtotal = itemPrice * itemQuantity;

  return (
    <Card style={{ minHeight: '400px' }}>
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

        <Typography variant="body1">
          Price: ${itemPrice.toFixed(2)}
        </Typography>

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

        <Typography variant="body1">
          Subtotal: ${subtotal.toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained" color="error" onClick={onDeleteItem}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}

export default CartItem;