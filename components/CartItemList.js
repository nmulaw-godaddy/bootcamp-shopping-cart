import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import CartItem from './CartItem';

function CartItemList({ sharedCart, onCartItemsChange }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (sharedCart) {
      setCartItems(sharedCart);
      return;
    }

    const getCartItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/cartitems');
        const json = await response.json();

        console.log('Cart items from API:', json);

        setCartItems(json);
        if (onCartItemsChange) {
          onCartItemsChange(json);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    getCartItems();
  }, [sharedCart]);

  const updateCartItemQuantity = async (id, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/cartitems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        setCartItems(cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        const json = await response.json();
        alert(json.message || 'Failed to update quantity.');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

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

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const totalPrice = safeCartItems
    .map((item) => {
      const itemPrice = Number(item?.is_on_sale ? item?.sale_price : item?.price);
      const quantity = Number(item?.quantity || 1);

      return quantity * itemPrice;
    })
    .reduce((a, b) => a + b, 0);

  return (
    <div>
      <Grid container direction="column" spacing={3}>
        {safeCartItems.map((item) => (
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
              onQuantityChange={(newQty) => updateCartItemQuantity(item.id, newQty)}
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
    </div>
  );
}

export default CartItemList;
  
