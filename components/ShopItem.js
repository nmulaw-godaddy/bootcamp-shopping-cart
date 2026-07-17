import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Typography, Button, CardMedia, IconButton, Chip, Box,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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
    onAddToCart({
      product_id: id,
      name,
      description,
      image_url: displayImage,
      price: displayPrice,
      is_on_sale,
      sale_price,
      quantity: selectedQty,
    });
  };

  const addToWishlist = () => {
    onAddToWishlist({
      product_id: id,
      name,
      description,
      image_url: displayImage,
      price: displayPrice,
      is_on_sale,
      sale_price,
    });
  };

  const discountPercent = is_on_sale && price && sale_price
    ? Math.round(((price - sale_price) / price) * 100)
    : 0;

  return (
    <Card
      sx={{
        opacity: outOfStock ? 0.65 : 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '20px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...(!outOfStock && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 40px rgba(255, 92, 147, 0.18)',
          },
        }),
      }}
    >
      {/* Sale badge */}
      {is_on_sale && (
        <Chip
          label={`${discountPercent}% OFF`}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            fontWeight: 700,
            fontSize: '0.7rem',
            backgroundColor: '#FF5C93',
            color: '#ffffff',
            height: 22,
            borderRadius: 999,
            boxShadow: '0 2px 8px rgba(255,92,147,0.4)',
          }}
        />
      )}

      {/* Wishlist heart */}
      <IconButton
        aria-label={`add ${name} to wishlist`}
        onClick={addToWishlist}
        size="small"
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1,
          backgroundColor: 'rgba(255,255,255,0.92)',
          border: '1px solid #F5CEDC',
          width: 32,
          height: 32,
          '&:hover': { backgroundColor: '#FFF0F6', '& svg': { color: '#FF5C93' } },
        }}
      >
        <FavoriteBorderIcon sx={{ fontSize: 16, color: '#FF8AAE' }} />
      </IconButton>

      {/* Product image */}
      {displayImage && (
        <Box sx={{ overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
          <CardMedia
            component="img"
            height="180"
            image={displayImage}
            alt={name}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              ...(!outOfStock && { '&:hover': { transform: 'scale(1.04)' } }),
            }}
          />
        </Box>
      )}

      <CardContent sx={{ flex: 1, p: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5, color: '#432818', lineHeight: 1.3 }}>
          {name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#7A6A61',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
            mb: 1,
            fontSize: '0.8rem',
          }}
        >
          {description}
        </Typography>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          {is_on_sale ? (
            <>
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#7A6A61', fontSize: '0.8rem' }}>
                ${Number(price).toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FF5C93', fontSize: '1rem' }}>
                ${Number(sale_price).toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#432818', fontSize: '1rem' }}>
              ${Number(price).toFixed(2)}
            </Typography>
          )}
        </Box>

        {outOfStock && (
          <Typography variant="caption" sx={{ color: '#FF5C93', fontWeight: 600, display: 'block' }}>
            Out of Stock
          </Typography>
        )}
        {!outOfStock && stockQuantity < 5 && (
          <Typography variant="caption" sx={{ color: '#FF8AAE', fontWeight: 600, display: 'block' }}>
            Only {stockQuantity} remaining!
          </Typography>
        )}

        {/* Quantity stepper */}
        {!outOfStock && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
              disabled={selectedQty <= 1}
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: 999,
                borderColor: '#F5CEDC',
                color: '#FF5C93',
                fontSize: '1rem',
                '&:hover': { borderColor: '#FF5C93', backgroundColor: 'rgba(255,92,147,0.04)' },
              }}
              aria-label="decrease quantity"
            >
              −
            </Button>
            <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center', fontWeight: 600, color: '#432818' }}>
              {selectedQty}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedQty(Math.min(stockQuantity, selectedQty + 1))}
              disabled={selectedQty >= stockQuantity}
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: 999,
                borderColor: '#F5CEDC',
                color: '#FF5C93',
                fontSize: '1rem',
                '&:hover': { borderColor: '#FF5C93', backgroundColor: 'rgba(255,92,147,0.04)' },
              }}
              aria-label="increase quantity"
            >
              +
            </Button>
          </Box>
        )}
        {outOfStock && (
          <Box sx={{ mt: 1, height: 32 }} />
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={addToCart}
          disabled={outOfStock}
          startIcon={<AddShoppingCartIcon sx={{ fontSize: '1rem !important' }} />}
          sx={{ borderRadius: 12, py: 1.1, fontSize: '0.85rem', fontWeight: 700 }}
          aria-label={`add ${name} to cart`}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );

}

export default ShopItem;
