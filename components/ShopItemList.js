import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import { useRouter } from 'next/router';
import ShopItem from './ShopItem';

function ShopItemList() {
  const getProductsUrl = 'http://localhost:8000/v1/products';
  const addToCartUrl = 'http://localhost:8000/v1/cartitems';
  const addToWishlistUrl = 'http://localhost:8000/v1/wishlistitems';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      router.push('/cart');
    } catch {
      // silently ignore
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const response = await fetch(addToWishlistUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) return;
      router.push('/wishlist');
    } catch {
      // silently ignore
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
    <Grid container spacing={3}>
      {filtered.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <ShopItem
            id={product.id}
            name={product.name}
            description={product.description}
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
  );
}

export default ShopItemList;
