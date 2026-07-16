import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import WishlistItem from './WishlistItem';

function WishlistItemList() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const getWishlistItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/wishlistitems');

        if (!response.ok) {
          console.error('Wishlist API failed:', response.status);
          setWishlistItems([]);
          return;
        }

        const json = await response.json();

        console.log('Wishlist items from API:', json);

        setWishlistItems(json);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
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
      if (!response.ok) {
        console.error('Failed to add to cart:', response.status);
        return;
      }
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const deleteWishlistItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/wishlistitems/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const newItems = wishlistItems.filter((item) => item.id !== id);
        setWishlistItems(newItems);
      } else {
        alert(`Failed to delete wishlist item ${id}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
    }
  };

  return (
    <div>
      {wishlistItems.length === 0 ? (
        <Typography variant="h5">Your wishlist is empty.</Typography>
      ) : (
        <Grid container direction="row" spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <WishlistItem
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
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default WishlistItemList;
