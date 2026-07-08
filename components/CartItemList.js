import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import Link from 'next/link';
import CartItem from './CartItem';

function CartItemList() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/cartitems');
        const json = await response.json();

        console.log('Cart items from API:', json);

        setCartItems(json);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    getCartItems();
  }, []);

  const deleteCartItem = async (id) => {
    try {
      console.log('Deleting cart item id:', id);

      const response = await fetch(`http://localhost:8000/v1/cartitems/${id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        const newItems = cartItems.filter((item) => item.id !== id);
        setCartItems(newItems);
      } else {
        alert(`Failed to delete item ${id}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const totalPrice = cartItems
    .map((item) => {
      const itemPrice = Number(item.price);
      const quantity = Number(item.quantity || 1);

      return quantity * itemPrice;
    })
    .reduce((a, b) => a + b, 0);

  return (
    <div>
      <Grid container direction="column" spacing={3}>
        {cartItems.map((item) => (
          <Grid item xs={6} key={item.id}>
            <CartItem
              product_id={item.product_id}
              name={item.name}
              description={item.description}
              image_url={item.image_url}
              price={item.price}
              is_on_sale={item.is_on_sale}
              sale_price={item.sale_price}
              quantity={item.quantity || 1}
              onDeleteItem={() => deleteCartItem(item.id)}
            />
          </Grid>
        ))}
      </Grid>

      <div style={{ paddingTop: '20px' }}>
        <Typography variant="h3">
          Total Price: ${totalPrice.toFixed(2)}
        </Typography>
      </div>
      <Link href="/checkout" passHref>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={cartItems.length === 0}
          style={{ marginTop: '20px', marginRight: '12px' }}
        >
          Proceed to Checkout
        </Button>
      </Link>
      <Link href="/shop" passHref>
        <Button
          variant="outlined"
          size="large"
          style={{ marginTop: '20px' }}
        >
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}

export default CartItemList;
  
