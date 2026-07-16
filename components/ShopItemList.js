import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import ShopItem from './ShopItem';

function ShopItemList() {
  const getProductsUrl = 'http://localhost:8000/v1/products';
  const addToCartUrl = 'http://localhost:8000/v1/cartitems';
  const addToWishlistUrl = 'http://localhost:8000/v1/wishlistitems';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartToastOpen, setCartToastOpen] = useState(false);
  const [cartToastItem, setCartToastItem] = useState('');
  const router = useRouter();
  const searchTerm = (router.query.q || '').toLowerCase();


  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(getProductsUrl, {
          method: 'GET',
        });

        const json = await response.json();
        console.log('API response:', json);
        setProducts(Array.isArray(json) ? json : []);
      } catch (error) {
        console.error('Error fetching products:', error);
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
        if (!patchResponse.ok) {
          console.error('Failed to update cart item quantity');
          return;
        }
      } else {
        const postResponse = await fetch(addToCartUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        if (!postResponse.ok) {
          console.error('Failed to add item to cart');
          return;
        }
      }


      setCartToastItem(product.name);
      setCartToastOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const body = JSON.stringify(product);

      const response = await fetch(addToWishlistUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        console.error('Add to wishlist failed:', await response.text());
        return;
      }

      router.push('/wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (products.length === 0) return <Typography>No products available.</Typography>;

  const safeProducts = Array.isArray(products) ? products : [];
  const filtered = searchTerm
    ? safeProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description || '').toLowerCase().includes(searchTerm)
      )
    : safeProducts;

  return (
    <>
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

    <Grid container direction="row" spacing={1}>
      {filtered && filtered.map((product) => (
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
    </>
  );
}

export default ShopItemList;
