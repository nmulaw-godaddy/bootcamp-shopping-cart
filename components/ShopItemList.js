import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import ShopItem from './ShopItem';

function ShopItemList() {
  const getProductsUrl = 'http://localhost:8000/v1/products';
  const addToCartUrl = 'http://localhost:8000/v1/cartitems';
  const addToWishlistUrl = 'http://localhost:8000/v1/wishlistitems';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistToastOpen, setWishlistToastOpen] = useState(false);
  const [wishlistToastItem, setWishlistToastItem] = useState('');
  const [cartToastOpen, setCartToastOpen] = useState(false);
  const [cartToastItem, setCartToastItem] = useState('');
  const router = useRouter();
  const searchTerm = (router.query.q || '').toLowerCase();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(getProductsUrl);
        const json = await response.json();
        setProducts(Array.isArray(json) ? json : []);
      } catch {
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const cartResponse = await fetch(addToCartUrl);
      const cartItems = cartResponse.ok ? await cartResponse.json() : [];
      const existing = Array.isArray(cartItems)
        ? cartItems.find((item) => item.product_id === product.product_id)
        : null;

      if (existing) {
        const newQty = Number(existing.quantity || 1) + Number(product.quantity || 1);
        const patchResponse = await fetch(`${addToCartUrl}/${existing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQty }),
        });
        if (!patchResponse.ok) return;
      } else {
        const postResponse = await fetch(addToCartUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        if (!postResponse.ok) return;
      }

      setCartToastItem(product.name);
      setCartToastOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const response = await fetch(addToWishlistUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        console.error('Add to wishlist failed:', await response.text());
        return;
      }

      setWishlistToastItem(product.name);
      setWishlistToastOpen(true);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#FF5C93' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" sx={{ color: '#FF5C93' }}>{error}</Typography>
      </Box>
    );
  }

  const safeProducts = Array.isArray(products) ? products : [];
  const filtered = searchTerm
    ? safeProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description || '').toLowerCase().includes(searchTerm)
      )
    : safeProducts;

  if (filtered.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: '#432818', mb: 0.5 }}>No products found</Typography>
        <Typography variant="body2" sx={{ color: '#7A6A61' }}>
          {searchTerm ? `No results for "${searchTerm}"` : 'Check back soon!'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Snackbar
        open={wishlistToastOpen}
        autoHideDuration={3000}
        onClose={() => setWishlistToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setWishlistToastOpen(false)} severity="success" variant="filled">
          ❤️ <strong>{wishlistToastItem}</strong> added to your wishlist!
        </Alert>
      </Snackbar>

      <Snackbar
        open={cartToastOpen}
        autoHideDuration={3000}
        onClose={() => setCartToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setCartToastOpen(false)} severity="info" variant="filled">
          🛒 <strong>{cartToastItem}</strong> added to your cart!
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {filtered.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ShopItem
              id={product.id}
              name={product.name}
              description={product.description}
              long_description={product.long_description}
              image_url={product.image_url}
              price={product.price}
              is_on_sale={product.is_on_sale}
              sale_price={product.sale_price}
              stockQuantity={product.quantity}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ShopItemList;
