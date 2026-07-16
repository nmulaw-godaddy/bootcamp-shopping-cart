import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia, IconButton, Chip, Box, Dialog, DialogContent } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';

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

function ShopItem({ id, name, description, long_description, image_url, price, is_on_sale, sale_price, stockQuantity, onAddToCart, onAddToWishlist }) {

  const displayImage = getImageUrl(id, image_url);
  const outOfStock = isOutOfStock(stockQuantity);
  const [selectedQty, setSelectedQty] = useState(1);
  const [open, setOpen] = useState(false);

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
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ backgroundColor: 'rgb(12,51,84)', color: 'white', p: 3, position: 'relative' }}>
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <img src={displayImage} alt={name} style={{ width: '100%', borderRadius: '8px', marginBottom: '16px', display: 'block' }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>{name}</Typography>

          <Typography variant="body2" sx={{ mb: long_description ? 1 : 2, color: 'rgba(255,255,255,0.8)' }}>
            {description}
          </Typography>

          {long_description && (
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.65)' }}>
              {long_description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            {is_on_sale ? (
              <>
                <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.5)' }}>
                  ${price}
                </Typography>
                <Typography variant="h5" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>${sale_price}</Typography>
                <Typography variant="body2" sx={{ color: '#ff6b6b' }}>{discountPercent}% off</Typography>
              </>
            ) : (
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>${price}</Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Button size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => setSelectedQty(q => Math.max(1, q - 1))} disabled={outOfStock || selectedQty <= 1}>−</Button>
            <Typography sx={{ color: 'white', minWidth: '24px', textAlign: 'center' }}>{selectedQty}</Typography>
            <Button size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => setSelectedQty(q => q + 1)} disabled={outOfStock || selectedQty >= stockQuantity}>+</Button>
          </Box>

          <Typography variant="body2" fontWeight="bold" sx={{ color: outOfStock ? '#ff6b6b' : '#4caf50', mb: 2 }}>
            {outOfStock ? 'Out of Stock' : 'In-Stock'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton onClick={addToWishlist} sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <FavoriteBorderIcon />
            </IconButton>
            <Button variant="contained" color="primary" onClick={addToCart} disabled={outOfStock} fullWidth>
              Add to Cart
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

    <Card
      sx={{ opacity: outOfStock ? 0.5 : 1, height: '460px', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer' }}
      onClick={() => setOpen(true)}
    >
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
            onClick={(e) => { e.stopPropagation(); setSelectedQty(q => Math.max(1, q - 1)); }}
            disabled={outOfStock || selectedQty <= 1}
          >−</Button>
          <Typography variant="body1">{selectedQty}</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => { e.stopPropagation(); setSelectedQty(q => q + 1); }}
            disabled={outOfStock || selectedQty >= stockQuantity}
          >+</Button>
        </div>
      </CardContent>

      <CardActions>
        <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); addToCart(); }} disabled={outOfStock}>
          Add to Cart
        </Button>

        <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); addToWishlist(); }}>
          <FavoriteBorderIcon />
        </IconButton>
      </CardActions>
    </Card>
    </div>
  );

}

export default ShopItem;