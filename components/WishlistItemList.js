import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import WishlistItem from './WishlistItem';

function WishlistItemList() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWishlistItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/wishlistitems');
        if (!response.ok) {
          setWishlistItems([]);
          return;
        }
        const json = await response.json();
        setWishlistItems(Array.isArray(json) ? json : []);
      } catch {
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    getWishlistItems();
  }, []);

  const addToCart = async (item) => {
    try {
      const response = await fetch('http://localhost:8000/v1/cartitems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: item.product_id,
          name: item.name,
          description: item.description,
          image_url: item.image_url,
          price: item.price,
          is_on_sale: item.is_on_sale,
          sale_price: item.sale_price,
          quantity: 1,
        }),
      });
      if (!response.ok) return;
      router.push('/cart');
    } catch {
      // silently ignore
    }
  };

  const deleteWishlistItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/wishlistitems/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(`Failed to delete wishlist item ${id}. Status: ${response.status}`);
      }
    } catch {
      // silently ignore
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#FF5C93' }} />
      </Box>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#432818', mb: 0.5 }}>Your wishlist is empty</Typography>
        <Typography variant="body2" sx={{ color: '#7A6A61' }}>
          Save products you love to your wishlist!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {wishlistItems.map((item) => (
        <WishlistItem
          key={item.id}
          product_id={item.product_id}
          name={item.name}
          description={item.description}
          image_url={item.image_url}
          price={item.price}
          is_on_sale={item.is_on_sale}
          sale_price={item.sale_price}
          onDeleteItem={() => deleteWishlistItem(item.id)}
          onAddToCart={() => addToCart(item)}
        />
      ))}
    </Box>
  );
}

export default WishlistItemList;
