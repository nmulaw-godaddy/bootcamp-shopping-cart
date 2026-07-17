import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, InputBase, IconButton, Button, Box,
  Badge, Popover, List, ListItem, ListItemText, Divider, Chip,
  useMediaQuery, Drawer, ListItemButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/router';
import doughmainLogo from '../images/doughmains.png';
import { useAuth } from './AuthContext';

const DonutIcon = () => (
  <Box
    component="img"
    src={doughmainLogo.src}
    alt="Doughmains logo"
    sx={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }}
  />
);

export default function NavBar() {
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [search, setSearch] = useState(router.query.q || '');
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setSearch(router.query.q || '');
  }, [router.query.q]);

  useEffect(() => {
    fetch('http://localhost:8000/v1/cartitems')
      .then((r) => r.json())
      .then((items) => {
        const arr = Array.isArray(items) ? items : [];
        setCartItems(arr);
        setCartCount(arr.reduce((s, i) => s + (i.quantity || 1), 0));
      })
      .catch(() => {});
  }, [router.pathname]);

  const handlePopoverOpen = (event) => {
    if (closeTimeout) { clearTimeout(closeTimeout); setCloseTimeout(null); }
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    const timeout = setTimeout(() => setAnchorEl(null), 200);
    setCloseTimeout(timeout);
  };

  const handlePopoverEnter = () => {
    if (closeTimeout) { clearTimeout(closeTimeout); setCloseTimeout(null); }
  };

  const open = Boolean(anchorEl);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.is_on_sale ? item.sale_price : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    router.push(`/shop?q=${encodeURIComponent(value)}`);
  };

  const NAV_LINKS = [
    { label: 'Shop', href: '/shop' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: { xs: 0.5, md: 1.5 }, px: { xs: 1.5, md: 3 }, minHeight: { xs: 60, md: 68 } }}>

        {/* Logo + wordmark */}
        <Link href="/shop" passHref legacyBehavior>
          <Box
            component="a"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexShrink: 0, '&:hover': { textDecoration: 'none' } }}
          >
            <DonutIcon />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#FF5C93',
                fontFamily: '"Satisfy", cursive',
                fontSize: { xs: '1.35rem', md: '1.6rem' },
                whiteSpace: 'nowrap',
                lineHeight: 1,
                letterSpacing: '0.03em',
                textShadow: '0 1px 0 rgba(185,28,65,0.25), 0 2px 6px rgba(185,28,65,0.12)',
              }}
            >
              Doughmains
            </Typography>
          </Box>
        </Link>

        {/* Search bar — flex:1 so it fills the middle */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.92)',
            border: '1.5px solid #F5CEDC',
            borderRadius: 999,
            px: 1.5,
            mx: { xs: 1, md: 2.5 },
            minWidth: 0,
            maxWidth: { md: 460 },
            '&:focus-within': { borderColor: '#FF5C93', boxShadow: '0 0 0 3px rgba(255,92,147,0.14)' },
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        >
          <SearchIcon sx={{ color: '#FF8AAE', fontSize: 18, mr: 0.5, flexShrink: 0 }} />
          <InputBase
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            inputProps={{ 'aria-label': 'search products' }}
            sx={{
              color: '#432818',
              width: '100%',
              fontSize: '0.875rem',
              fontFamily: '"Poppins", sans-serif',
              '& .MuiInputBase-input::placeholder': { color: '#7A6A61', opacity: 1 },
            }}
          />
        </Box>

        {/* Right group: nav links + cart + auth/menu — all pushed to far right */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0, ml: 'auto' }}>
          {/* Desktop nav links */}
          {!isMobile && NAV_LINKS.map(({ label, href }) => {
            const active = router.pathname === href;
            return (
              <Link key={href} href={href} passHref legacyBehavior>
                <Button
                  component="a"
                  sx={{
                    color: '#FF5C93',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.875rem',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    backgroundColor: active ? 'rgba(255,92,147,0.1)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255,92,147,0.08)' },
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </Button>
              </Link>
            );
          })}

          {/* Cart icon */}
          <Link href="/cart" passHref legacyBehavior>
            <IconButton
              component="a"
              aria-label={`cart, ${cartCount} items`}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              sx={{ color: '#432818', position: 'relative' }}
            >
              <Badge badgeContent={cartCount || null} color="primary">
                <ShoppingCartIcon sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
          </Link>

          {/* Auth — desktop */}
          {!isMobile && (
            user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#7A6A61', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  Hi, {user.name}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={logout}
                  sx={{ borderRadius: 999, fontSize: '0.8rem', py: 0.5, px: 1.5, whiteSpace: 'nowrap' }}
                >
                  Log Out
                </Button>
              </Box>
            ) : (
              <Link href="/login" passHref legacyBehavior>
                <Button
                  component="a"
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: 999, fontSize: '0.85rem', py: 0.75, px: 2, whiteSpace: 'nowrap', flexShrink: 0, ml: 0.5 }}
                >
                  Log In
                </Button>
              </Link>
            )
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              aria-label="open navigation menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: '#432818', ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260, backgroundColor: '#FFE4F0', borderRadius: '20px 0 0 20px' } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#FF5C93', fontWeight: 700, fontFamily: '"Satisfy", cursive', fontSize: '1.35rem', letterSpacing: '0.03em', textShadow: '0 1px 0 rgba(185,28,65,0.2)' }}>
              Doughmains
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="close menu" sx={{ color: '#432818' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} passHref legacyBehavior>
                <ListItemButton
                  component="a"
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: router.pathname === href ? '#FF5C93' : '#432818',
                    fontWeight: router.pathname === href ? 700 : 500,
                    backgroundColor: router.pathname === href ? 'rgba(255,92,147,0.08)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255,92,147,0.06)' },
                  }}
                >
                  {label}
                </ListItemButton>
              </Link>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          {user ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#7A6A61', textAlign: 'center' }}>
                Signed in as {user.name}
              </Typography>
              <Button variant="outlined" onClick={() => { logout(); setDrawerOpen(false); }} fullWidth>
                Log Out
              </Button>
            </Box>
          ) : (
            <Link href="/login" passHref legacyBehavior>
              <Button variant="contained" fullWidth onClick={() => setDrawerOpen(false)}>
                Log In
              </Button>
            </Link>
          )}
        </Box>
      </Drawer>

      {/* Mini cart popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableRestoreFocus
        sx={{ pointerEvents: 'none' }}
        slotProps={{
          paper: {
            onMouseEnter: handlePopoverEnter,
            onMouseLeave: handlePopoverClose,
            sx: {
              pointerEvents: 'auto',
              minWidth: 300,
              maxWidth: 380,
              mt: 1,
              border: '1.5px solid #F5CEDC',
              boxShadow: '0 12px 30px rgba(255,92,147,0.15)',
              overflow: 'hidden',
            },
          }
        }}
      >
        {/* Popover header */}
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #F5CEDC', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={doughmainLogo.src}
            alt=""
            sx={{ width: 28, height: 28, objectFit: 'contain' }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#432818' }}>Cart Preview</Typography>
          <Link href="/cart" passHref legacyBehavior>
            <Button
              component="a"
              variant="contained"
              size="small"
              sx={{ ml: 'auto', borderRadius: 999, fontSize: '0.75rem', py: 0.5, px: 1.5 }}
              onClick={handlePopoverClose}
            >
              View Cart
            </Button>
          </Link>
        </Box>

        <Box sx={{ p: 2 }}>
          {cartItems.length === 0 ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <ShoppingCartIcon sx={{ fontSize: 36, color: '#F5CEDC', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">Your cart is empty</Typography>
            </Box>
          ) : (
            <>
              <List sx={{ py: 0, maxHeight: 260, overflow: 'auto' }}>
                {cartItems.map((item) => {
                  const price = item.is_on_sale ? item.sale_price : item.price;
                  const qty = item.quantity || 1;
                  return (
                    <ListItem key={item.id} sx={{ px: 0, py: 1, borderBottom: '1px solid #F5CEDC', '&:last-child': { borderBottom: 0 } }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#432818', lineHeight: 1.3 }}>
                              {item.name}
                              {item.is_on_sale && (
                                <Chip
                                  label="SALE"
                                  size="small"
                                  sx={{ ml: 0.75, height: 16, fontSize: '0.6rem', backgroundColor: '#FF5C93', color: '#fff', fontWeight: 700 }}
                                />
                              )}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                            <Typography variant="caption" color="text.secondary">Qty: {qty}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#FF5C93' }}>
                              ${(price * qty).toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#432818' }}>Total:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FF5C93' }}>
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Popover>
    </AppBar>
  );
}
