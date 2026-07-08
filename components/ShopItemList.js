import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import ShopItem from './ShopItem';

function ShopItemList() {
  const getProductsUrl = 'http://localhost:8000/v1/products';
  const addToCartUrl = 'http://localhost:8000/v1/cartitems';
  const addToWishlistUrl = 'http://localhost:8000/v1/wishlistitems';

  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(getProductsUrl, {
          method: 'GET',
        });

        const json = await response.json();
        setProducts(json);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      console.log('Product being added to cart:', product);

      const body = JSON.stringify(product);

      const response = await fetch(addToCartUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      console.log('Add to cart response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add to cart failed:', errorText);
        return;
      }

      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      console.log('Product being added to wishlist:', product);

      const body = JSON.stringify(product);

      const response = await fetch(addToWishlistUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      console.log('Add to wishlist response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add to wishlist failed:', errorText);
        return;
      }

      router.push('/wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <Grid container direction="row" spacing={1}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <ShopItem
            id={product.id}
            name={product.name}
            description={product.description}
            image_url={product.image_url}
            price={product.price}
            is_on_sale={product.is_on_sale}
            sale_price={product.sale_price}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ShopItemList;
