import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Divider, CircularProgress, Box, Paper, Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from '../components/head';

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
      } catch {
        setError('Something went wrong loading your order.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);


  if (loading) {
    return (
      <Container sx={{ pt: 10, textAlign: 'center' }}>
        <Head title="Order Confirmation" />
        <CircularProgress sx={{ color: '#FF5C93' }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Head title="Order Error" />
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Link href="/shop" passHref>
          <Button variant="contained" sx={{ borderRadius: 12 }}>Back to Shop</Button>
        </Link>
      </Container>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryString = estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <Container maxWidth="sm" sx={{ pt: { xs: 4, md: 6 }, pb: 6 }}>
      <Head title="Order Confirmed" />

      {/* Success icon */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 8px 24px rgba(255,92,147,0.3)',
          }}
        >
          <CheckCircleIcon sx={{ color: '#fff', fontSize: 44 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#432818', mb: 0.75, fontSize: { xs: '1.7rem', md: '2rem' } }}>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" sx={{ color: '#7A6A61' }}>
          Thank you for your purchase, {order.name}. Your order has been placed successfully.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, border: '1.5px solid #F5CEDC', boxShadow: '0 8px 24px rgba(255,92,147,0.08)', mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#7A6A61', display: 'block', mb: 0.25 }}>Order Number</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#432818' }}>#{order.id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#7A6A61', display: 'block', mb: 0.25 }}>Estimated Delivery</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#432818' }}>{deliveryString}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2.5 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#432818', mb: 1.5 }}>
          Shipping Address
        </Typography>
        <Typography variant="body2" sx={{ color: '#7A6A61', lineHeight: 1.8 }}>
          {order.name}<br />
          {order.address}<br />
          {order.city}, {order.state} {order.zip_code}<br />
          {order.email}
        </Typography>

        <Divider sx={{ my: 2.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#432818' }}>Total Charged</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF5C93' }}>
            ${Number(order.total_price).toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      <Link href="/shop" passHref>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ borderRadius: 12, py: 1.4, fontWeight: 700, fontSize: '1rem' }}
        >
          Continue Shopping
        </Button>
      </Link>
    </Container>
  );
}

export default OrderConfirmation;
