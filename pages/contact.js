import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Alert, Paper, Grid,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Head from '../components/head';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    '& fieldset': { borderColor: '#F5CEDC' },
    '&:hover fieldset': { borderColor: '#FF8AAE' },
    '&.Mui-focused fieldset': { borderColor: '#FF5C93', borderWidth: 2 },
    '& input, & textarea': { color: '#432818' },
  },
  '& .MuiInputLabel-root': { color: '#7A6A61' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#FF5C93' },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: { xs: 3, md: 5 }, pb: 6 }}>
      <Head title="Contact Us" />

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#432818', mb: 0.75, fontSize: { xs: '1.7rem', md: '2rem' } }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ color: '#7A6A61' }}>
          We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you soon!
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{ p: { xs: 3, sm: 4 }, border: '1.5px solid #F5CEDC', boxShadow: '0 12px 40px rgba(255,92,147,0.08)' }}
      >
        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#432818', mb: 1 }}>
              Message sent!
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A6A61', mb: 3 }}>
              Thanks for reaching out, {form.name}. We&apos;ll be in touch soon!
            </Typography>
            <Button
              variant="outlined"
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
              sx={{ borderRadius: 999, borderColor: '#F5CEDC', color: '#FF5C93' }}
            >
              Send another message
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 12 }}>{error}</Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={inputSx}
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={inputSx}
                  autoComplete="email"
                />
              </Grid>
            </Grid>

            <TextField
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              fullWidth
              sx={inputSx}
            />

            <TextField
              label="Message *"
              name="message"
              value={form.message}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={5}
              sx={{
                ...inputSx,
                '& .MuiOutlinedInput-root': {
                  ...inputSx['& .MuiOutlinedInput-root'],
                  alignItems: 'flex-start',
                },
              }}
              placeholder="Tell us how we can help..."
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={<EmailOutlinedIcon />}
              sx={{ borderRadius: 12, py: 1.4, fontWeight: 700, fontSize: '0.95rem', mt: 0.5 }}
            >
              Send Message
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
