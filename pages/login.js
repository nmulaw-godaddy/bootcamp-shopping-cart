import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Link as MuiLink } from '@mui/material';
import { useAuth } from '../components/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, signup, logout } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'login' ? login(email, password) : signup(name, email, password);
    if (result.error) {
      setError(result.error);
      return;
    }
    sessionStorage.setItem('justLoggedIn', 'true');
    router.push('/shop');
  };

  if (user) {
    return (
      <Container maxWidth="xs" sx={{ pt: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>You&apos;re logged in as {user.name}</Typography>
          <Button variant="outlined" onClick={logout}>Log Out</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ pt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          {mode === 'login' ? 'Log In' : 'Create an Account'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 'signup' && (
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" size="large">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <MuiLink component="button" type="button" onClick={() => { setMode('signup'); setError(''); }}>
                Sign up
              </MuiLink>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <MuiLink component="button" type="button" onClick={() => { setMode('login'); setError(''); }}>
                Log in
              </MuiLink>
            </>
          )}
        </Typography>
      </Paper>
    </Container>
  );
}
