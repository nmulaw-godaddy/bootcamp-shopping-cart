import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia } from '@mui/material'
import { getImageUrl } from './ShopItem';

function CartItem({ product_id, name, description, image_url, price, is_on_sale, sale_price, quantity, onDeleteItem }) {

  const displayImage = getImageUrl(product_id, image_url);

  const itemPrice = Number(is_on_sale ? sale_price : price);
  const itemQuantity = Number(quantity || 1);
  const subtotal = itemPrice * itemQuantity;

  return (
    <Card style={{ height: '400px' }}>
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

        <Typography variant="body1">
          Quantity: {itemQuantity}
        </Typography>

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