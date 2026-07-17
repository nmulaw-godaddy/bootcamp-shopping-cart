import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, TextField, Button, Divider,
  CircularProgress, Box, Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import Head from '../components/head';

const SectionCard = ({ number, title, children }) => (
  <Box
    sx={{
      backgroundColor: '#FFFFFF',
      border: '1.5px solid #F5CEDC',
      borderRadius: '20px',
      p: { xs: 2.5, md: 3 },
      boxShadow: '0 4px 16px rgba(255,92,147,0.06)',
      mb: 2.5,
    }}
  >
    {number && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {number}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#432818' }}>{title}</Typography>
      </Box>
    )}
    {!number && title && (
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#432818', mb: 2 }}>{title}</Typography>
    )}
    {children}
  </Box>
);

function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', state: '', zip_code: '',
    card_number: '', expiry: '', cvv: '',
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/cartitems');
        const json = await response.json();
        setCartItems(Array.isArray(json) ? json : []);
      } catch {
        // silently ignore
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
          name: form.name, email: form.email, address: form.address,
          city: form.city, state: form.state, zip_code: form.zip_code,
          total_price: total,
        }),
      });
      if (!response.ok) {
        setSubmitting(false);
        return;
      }
      const order = await response.json();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch {
      setSubmitting(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      color: '#432818',
      '& fieldset': { borderColor: '#F5CEDC' },
      '&:hover fieldset': { borderColor: '#FF8AAE' },
      '&.Mui-focused fieldset': { borderColor: '#FF5C93' },
      '& input': { color: '#432818' },
    },
    '& .MuiInputLabel-root': { color: '#7A6A61' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#FF5C93' },
  };

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>
      <Head title="Checkout" />

      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#432818', lineHeight: 1.2, fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Checkout
          </Typography>
          <Typography variant="body2" sx={{ color: '#7A6A61', mt: 0.25 }}>
            Almost there! Let&apos;s get your order sorted.
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={4}>

          {/* LEFT: form */}
          <Grid item xs={12} md={7}>
            <SectionCard number="1" title="Shipping Information">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth required sx={inputSx} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required sx={inputSx} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Street Address" name="address" value={form.address} onChange={handleChange} fullWidth required sx={inputSx} placeholder="123 Doughnut Ave" />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth required sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="State" name="state" value={form.state} onChange={handleChange} fullWidth required sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="ZIP Code" name="zip_code" value={form.zip_code} onChange={handleChange} fullWidth required sx={inputSx} />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard number="2" title="Payment Details">
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
                    placeholder="1234 1234 1234 1234"
                    sx={inputSx}
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
                    placeholder="MM / YY"
                    sx={inputSx}
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
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* RIGHT: order summary */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 80 } }}>
              <SectionCard title="Order Summary">
                <Typography variant="caption" sx={{ color: '#7A6A61', display: 'block', mb: 2 }}>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </Typography>

                {loadingCart ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={28} />
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                      {cartItems.map((item) => (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#432818', lineHeight: 1.3 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#7A6A61' }}>
                              Qty: {item.quantity || 1}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#432818', flexShrink: 0 }}>
                            ${(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#7A6A61' }}>Subtotal</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#432818' }}>${subtotal.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#7A6A61' }}>Tax (8%)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#432818' }}>${tax.toFixed(2)}</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#432818' }}>Total</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF5C93' }}>
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Sweet deal message */}
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        backgroundColor: '#FFF0F6',
                        border: '1px solid #F5CEDC',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#FF5C93', display: 'block' }}>
                          Sweet deal!
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7A6A61', lineHeight: 1.4 }}>
                          You&apos;re one step closer to a more secure business.
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </SectionCard>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting || loadingCart || cartItems.length === 0}
                endIcon={submitting ? null : <ArrowForwardIcon />}
                sx={{ borderRadius: 12, py: 1.6, fontWeight: 700, fontSize: '1rem' }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Place Order'}
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mt: 1.5 }}>
                <LockIcon sx={{ fontSize: 13, color: '#7A6A61' }} />
                <Typography variant="caption" sx={{ color: '#7A6A61' }}>
                  Your payment information is secure and encrypted.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Checkout;
