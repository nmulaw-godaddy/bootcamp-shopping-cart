import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Divider, CircularProgress, Grid, Paper, } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';

function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:8000/v1/orders/${orderId}`);
        if (!response.ok) {
          setError('Could not find your order.');
          return;
        }
        const json = await response.json();
        setOrder(json);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Something went wrong loading your order.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);


  if (loading) {
    return (
      <Container style={{ paddingTop: '80px', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ paddingTop: '80px' }}>
        <Typography color="error">{error}</Typography>
        <Link href="/shop" passHref>
          <Button variant="contained" style={{ marginTop: '16px' }}>
            Back to Shop
          </Button>
        </Link>
      </Container>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryString = estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container maxWidth="sm" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Order Confirmed! 🍩
      </Typography>

      <Paper elevation={3} sx={{ p: 3, bgcolor: 'white', color: 'black' }}>

        <Typography variant="body1" gutterBottom>
          Thank you for your purchase, {order.name}. Your order has been placed successfully.
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Order Number</Typography>
            <Typography variant="body1">#{order.id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Estimated Delivery</Typography>
            <Typography variant="body1">{deliveryString}</Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '24px 0' }} />

        <Typography variant="h6" gutterBottom>
          Shipping Address
        </Typography>
        <Typography variant="body1">{order.name}</Typography>
        <Typography variant="body1">{order.address}</Typography>
        <Typography variant="body1">
          {order.city}, {order.state} {order.zip_code}
        </Typography>
        <Typography variant="body1">{order.email}</Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Grid container justifyContent="space-between">
          <Typography variant="h6">Total Charged</Typography>
          <Typography variant="h6">${Number(order.total_price).toFixed(2)}</Typography>
        </Grid>

        <Link href="/shop" passHref>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            style={{ marginTop: '32px' }}
          >
            Continue Shopping
          </Button>
        </Link>

      </Paper>
    </Container>
  );
}

export default OrderConfirmation;
