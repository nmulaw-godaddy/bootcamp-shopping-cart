import React from 'react';
import {Card, CardContent, CardActions, Typography, Button, CardMedia} from '@mui/material';

const images = [
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/c8d98599-46cc-412d-bbb5-d766bb0e5a05/Product-grid-SSL.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/44957d35-8edb-43cf-b518-457ff48a7e16/Product-grid-WDS.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/4626b5ac-8ac0-4e88-ae38-dd94cb12a89d/Product-grid-Email.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/c8d98599-46cc-412d-bbb5-d766bb0e5a05/Product-grid-SSL.jpg",
  "https://img1.wsimg.com/cdn/Image/All/AllChannelsFoS/1/en-US/8f679b96-df22-41fc-afd8-854d47a1c634/Product-grid-Hosting.jpg",
  "https://img1.wsimg.com/cdn/Image/All/FOS-Intl/1/en-US/3b91b99f-57eb-44bd-b2e1-1cfd6529bbfb/feat-ols-your-store-your-way.jpg?impolicy=cms-feature-module"
];

function WishlistItem({ product_id, name, description, image_url, price, is_on_sale, sale_price, onDeleteItem }) {
  const imageIndex = product_id ? (Number(product_id) - 1) % images.length : 0;
  const displayImage = image_url || images[imageIndex];

  const itemPrice = Number(is_on_sale ? sale_price : price);

  return (
    <Card style={{ height: '400px' }}>
      {displayImage && (
        <CardMedia
          component="img"
          height="200"
          image={displayImage}
          alt={name}
        />
      )}

      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Typography variant="body1">
          Price: ${itemPrice.toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained" color="error" onClick={onDeleteItem}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}

export default WishlistItem;