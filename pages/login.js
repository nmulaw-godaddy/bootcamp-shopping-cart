import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert, Link as MuiLink,
  InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../components/AuthContext';
import Head from '../components/head';
import doughmainLogo from '../images/doughmains.png';

const DonutIllustration = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
    <Box
      component="img"
      src={doughmainLogo.src}
      alt="Doughmains donut"
      sx={{ width: 80, height: 80, objectFit: 'contain' }}
    />
  </Box>
);

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    '& fieldset': { borderColor: '#F5CEDC' },
    '&:hover fieldset': { borderColor: '#FF8AAE' },
    '&.Mui-focused fieldset': { borderColor: '#FF5C93', borderWidth: 2 },
    '& input': { color: '#432818' },
  },
  '& .MuiInputLabel-root': { color: '#7A6A61' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#FF5C93' },
};

export default function LoginPage() {
  const router = useRouter();
  const { user, login, signup, logout } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'login' ? login(email, password) : signup(name, email, password);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push('/shop');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  if (user) {
    return (
      <Container maxWidth="xs" sx={{ pt: 8 }}>
        <Head title="Account" />
        <Paper sx={{ p: 4, textAlign: 'center', border: '1.5px solid #F5CEDC' }}>
          <DonutIllustration />
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700, color: '#432818' }}>
            You&apos;re logged in
          </Typography>
          <Typography variant="body2" sx={{ color: '#7A6A61', mb: 3 }}>
            Welcome back, {user.name}!
          </Typography>
          <Button variant="contained" onClick={logout} fullWidth sx={{ borderRadius: 12 }}>
            Log Out
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ pt: { xs: 4, md: 8 }, pb: 6 }}>
      <Head title={mode === 'login' ? 'Log In' : 'Create Account'} />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          border: '1.5px solid #F5CEDC',
          boxShadow: '0 12px 40px rgba(255,92,147,0.1)',
        }}
      >
        <DonutIllustration />

        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: '#432818', textAlign: 'center', mb: 0.5, fontSize: '1.7rem' }}
        >
          {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7A6A61', textAlign: 'center', mb: 3 }}>
          {mode === 'login'
            ? 'Sign in to your Doughmains account'
            : 'Join the Doughmains community today'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 12 }}>
            {error}
          </Alert>
        )}

        {/* Use a named form to avoid triggering header validation */}
        <Box
          component="form"
          id="auth-form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {mode === 'signup' && (
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoComplete="name"
              sx={inputSx}
            />
          )}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
            sx={inputSx}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide password' : 'show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: '#7A6A61' }}
                  >
                    {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ borderRadius: 12, py: 1.4, fontWeight: 700, fontSize: '1rem', mt: 0.5 }}
          >
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2.5, textAlign: 'center', color: '#7A6A61' }}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={() => switchMode('signup')}
                sx={{ color: '#FF5C93', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Sign up
              </MuiLink>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={() => switchMode('login')}
                sx={{ color: '#FF5C93', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Log in
              </MuiLink>
            </>
          )}
        </Typography>
      </Paper>
    </Container>
  );
}
