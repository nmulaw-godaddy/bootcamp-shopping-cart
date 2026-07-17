import React from 'react';
import { Box, Typography, Button, Chip, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

const images = [
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/c8d98599-46cc-412d-bbb5-d766bb0e5a05/Product-grid-SSL.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/44957d35-8edb-43cf-b518-457ff48a7e16/Product-grid-WDS.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/4626b5ac-8ac0-4e88-ae38-dd94cb12a89d/Product-grid-Email.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/c8d98599-46cc-412d-bbb5-d766bb0e5a05/Product-grid-SSL.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/8f679b96-df22-41fc-afd8-854d47a1c634/Product-grid-Hosting.jpg",
  "https://img1.wsimg.com/cdn/Image/All/FOS-Intl/1/en-US/3b91b99f-57eb-44bd-b2e1-1cfd6529bbfb/feat-ols-your-store-your-way.jpg?impolicy=cms-feature-module"
];

function WishlistItem({ product_id, name, description, image_url, price, is_on_sale, sale_price, onDeleteItem, onAddToCart }) {
  const imageIndex = product_id ? (Number(product_id) - 1) % images.length : 0;
  const displayImage = image_url || images[imageIndex];
  const itemPrice = Number(is_on_sale ? sale_price : price);

  const discountPercent = is_on_sale && price && sale_price
    ? Math.round(((price - sale_price) / price) * 100)
    : 0;

  return (
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
      {/* Remove button */}
      <IconButton
        size="small"
        onClick={onDeleteItem}
        aria-label={`remove ${name} from wishlist`}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#FF8AAE',
          '&:hover': { backgroundColor: '#FFF0F6', color: '#FF5C93' },
          width: 28,
          height: 28,
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Product image */}
      {displayImage && (
        <Box
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
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

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0, pr: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#432818', lineHeight: 1.3 }}>
            {name}
          </Typography>
          {is_on_sale && (
            <Chip
              label={`${discountPercent}% OFF`}
              size="small"
              sx={{
                height: 18, fontSize: '0.6rem', fontWeight: 700,
                backgroundColor: '#FF5C93', color: '#fff', borderRadius: 999,
              }}
            />
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#7A6A61', display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.25, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {is_on_sale && (
              <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#7A6A61' }}>
                ${Number(price).toFixed(2)}
              </Typography>
            )}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: is_on_sale ? '#FF5C93' : '#432818' }}>
              ${itemPrice.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddShoppingCartIcon sx={{ fontSize: '0.9rem !important' }} />}
            onClick={onAddToCart}
            sx={{ borderRadius: 999, fontSize: '0.78rem', py: 0.75, px: 1.75, fontWeight: 600 }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default WishlistItem;
