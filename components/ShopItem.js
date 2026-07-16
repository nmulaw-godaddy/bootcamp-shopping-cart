import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia, IconButton, Chip, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const images = [
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/c8d98599-46cc-412d-bbb5-d766bb0e5a05/Product-grid-SSL.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/44957d35-8edb-43cf-b518-457ff48a7e16/Product-grid-WDS.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/4626b5ac-8ac0-4e88-ae38-dd94cb12a89d/Product-grid-Email.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/c8d98599-46cc-412d-bbb5-d766bb0e5a05/Product-grid-SSL.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/8f679b96-df22-41fc-afd8-854d47a1c634/Product-grid-Hosting.jpg",
  "https://img1.wsimg.com/cdn/Image/All/FOS-Intl/1/en-US/3b91b99f-57eb-44bd-b2e1-1cfd6529bbfb/feat-ols-your-store-your-way.jpg?impolicy=cms-feature-module"
];

export function getImageUrl(id, image_url) {
  const imageIndex = id ? (Number(id) - 1) % images.length : 0;
  return image_url || images[imageIndex];
}

export function isOutOfStock(quantity) {
  return Number(quantity) === 0;
}

function ShopItem({ id, name, description, image_url, price, is_on_sale, sale_price, stockQuantity, onAddToCart, onAddToWishlist }) {

  const displayImage = getImageUrl(id, image_url);
  const outOfStock = isOutOfStock(stockQuantity);
  const [selectedQty, setSelectedQty] = useState(1);

  const displayPrice = Number(is_on_sale ? sale_price : price);

  const addToCart = () => {
    const newItem = {
      product_id: id,
      name,
      description,
      image_url: displayImage,
      price: displayPrice,
      is_on_sale,
      sale_price,
      quantity: selectedQty,
    };

    onAddToCart(newItem);
  };

  const addToWishlist = () => {
    const newItem = {
      product_id: id,
      name,
      description,
      image_url: displayImage,
      price: displayPrice,
      is_on_sale,
      sale_price,
    };

    onAddToWishlist(newItem);
  };

  const discountPercent = is_on_sale && price && sale_price
    ? Math.round(((price - sale_price) / price) * 100)
    : 0;

  return (
    <Card sx={{ opacity: outOfStock ? 0.5 : 1, height: '460px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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

      <CardContent sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography variant="h5" component="div">
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {is_on_sale ? (
            <>
              <Typography
                variant="body2"
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ${price}
              </Typography>
              <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                ${sale_price}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" color="text.primary">
              ${price}
            </Typography>
          )}
        </Box>

        {outOfStock && (
          <Typography variant="body2" color="error">
            Out of Stock
          </Typography>
        )}
        {!outOfStock && stockQuantity < 5 && (
          <Typography variant="body2" color="error">
            Only {stockQuantity} remaining!
          </Typography>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedQty(selectedQty - 1)}
            disabled={outOfStock || selectedQty <= 1}
          >−</Button>
          <Typography variant="body1">{selectedQty}</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedQty(selectedQty + 1)}
            disabled={outOfStock || selectedQty >= stockQuantity}
          >+</Button>
        </div>
      </CardContent>

      <CardActions>
        <Button variant="contained" color="primary" onClick={addToCart} disabled={outOfStock}>
          Add to Cart
        </Button>

        <IconButton color="secondary" onClick={addToWishlist}>
          <FavoriteBorderIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ShopItem;