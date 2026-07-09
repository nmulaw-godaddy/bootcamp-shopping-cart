import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, InputBase, IconButton, Button, Box, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useRouter } from 'next/router';
import doughmainLogo from '../images/doughmains.png';

export default function NavBar() {
  const router = useRouter();
  const [search, setSearch] = useState(router.query.q || '');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setSearch(router.query.q || '');
  }, [router.query.q]);

  useEffect(() => {
    fetch('http://localhost:8000/v1/cartitems')
      .then((r) => r.json())
      .then((items) => setCartCount(Array.isArray(items) ? items.length : 0))
      .catch(() => {});
  }, [router.pathname]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    router.push(`/shop?q=${encodeURIComponent(value)}`);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        {/* Left: logo + title */}
        <Link href="/shop" passHref legacyBehavior>
          <Box
            component="a"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
          >
            <Box
              component="img"
              src={doughmainLogo.src}
              alt="Doughmain logo"
              sx={{ width: 36, height: 36, borderRadius: 1, objectFit: 'contain', flexShrink: 0 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              Doughmain Products
            </Typography>
          </Box>
        </Link>

        {/* Center: search */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 1,
            px: 1,
            mx: 2,
          }}
        >
          <SearchIcon sx={{ mr: 1, opacity: 0.8 }} />
          <InputBase
            placeholder="Search products…"
            value={search}
            onChange={handleSearch}
            inputProps={{ 'aria-label': 'search products' }}
            sx={{ color: 'inherit', width: '100%' }}
          />
        </Box>

        {/* Right: nav links + cart */}
        {[
          { label: 'Shop', href: '/shop' },
          { label: 'Wishlist', href: '/wishlist' },
          { label: 'Contact Us', href: '/contact' },
        ].map(({ label, href }) => {
          const active = router.pathname === href;
          return (
            <Link key={href} href={href} passHref legacyBehavior>
              <Button
                color="inherit"
                sx={{ opacity: active ? 0.45 : 1, pointerEvents: active ? 'none' : 'auto' }}
              >
                {label}
              </Button>
            </Link>
          );
        })}
        <Link href="/cart" passHref legacyBehavior>
          <IconButton color="inherit" aria-label="cart">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
