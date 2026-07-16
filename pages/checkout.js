import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, TextField, Button, Divider, CircularProgress, Paper, } from '@mui/material';
import { useRouter } from 'next/router';

function Checkout() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    card_number: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/cartitems');
        const json = await response.json();
        setCartItems(json);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity || 1);
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          zip_code: form.zip_code,
          total_price: total,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Checkout failed:', err);
        setSubmitting(false);
        return;
      }

      const order = await response.json();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      console.error('Error during checkout:', error);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Checkout
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={6}>

          {/* LEFT COLUMN — Shipping + Payment */}
          <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'white', color: 'black' }}>

            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="ZIP Code"
                  name="zip_code"
                  value={form.zip_code}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom style={{ marginTop: '32px' }}>
              Payment Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  name="card_number"
                  value={form.card_number}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 19 }}
                  placeholder="1234 5678 9012 3456"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CVV"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 4 }}
                  placeholder="123"
                />
              </Grid>
            </Grid>
          </Paper>
          </Grid>

          {/* RIGHT COLUMN — Order Summary */}
          <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'white', color: 'black' }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>

            {loadingCart ? (
              <CircularProgress />
            ) : (
              <>
                {cartItems.map((item) => (
                  <Grid container justifyContent="space-between" key={item.id} style={{ marginBottom: '8px' }}>
                    <Grid item xs={8}>
                      <Typography variant="body1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity || 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} style={{ textAlign: 'right' }}>
                      <Typography variant="body1">
                        ${(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}

                <Divider style={{ margin: '16px 0' }} />

                <Grid container justifyContent="space-between">
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                </Grid>
                <Grid container justifyContent="space-between" style={{ marginTop: '4px' }}>
                  <Typography variant="body1">Tax (8%)</Typography>
                  <Typography variant="body1">${tax.toFixed(2)}</Typography>
                </Grid>

                <Divider style={{ margin: '16px 0' }} />

                <Grid container justifyContent="space-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </Grid>
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={submitting || loadingCart || cartItems.length === 0}
              style={{ marginTop: '24px' }}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Paper>
          </Grid>

        </Grid>
      </form>
    </Container>
  );
}

export default Checkout;
