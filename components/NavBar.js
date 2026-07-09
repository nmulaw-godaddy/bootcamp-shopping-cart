import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, InputBase, IconButton, Button, Box, Badge, Popover, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useRouter } from 'next/router';
import doughmainLogo from '../images/doughmains.png';

export default function NavBar() {
  const router = useRouter();
  const [search, setSearch] = useState(router.query.q || '');
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);

  useEffect(() => {
    setSearch(router.query.q || '');
  }, [router.query.q]);

  useEffect(() => {
    fetch('http://localhost:8000/v1/cartitems')
      .then((r) => r.json())
      .then((items) => {
        const itemsArray = Array.isArray(items) ? items : [];
        setCartItems(itemsArray);
        setCartCount(itemsArray.length);
      })
      .catch(() => {});
  }, [router.pathname]);

  const handlePopoverOpen = (event) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    const timeout = setTimeout(() => {
      setAnchorEl(null);
    }, 200);
    setCloseTimeout(timeout);
  };

  const handlePopoverEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const open = Boolean(anchorEl);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.is_on_sale ? item.sale_price : item.price;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

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
          <IconButton
            component="a"
            color="inherit"
            aria-label="cart"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Link>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          disableRestoreFocus
          sx={{
            pointerEvents: 'none',
          }}
          slotProps={{
            paper: {
              onMouseEnter: handlePopoverEnter,
              onMouseLeave: handlePopoverClose,
              sx: {
                pointerEvents: 'auto',
                minWidth: 320,
                maxWidth: 400,
                marginTop: '8px',
              }
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cart Preview
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {cartItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Your cart is empty
              </Typography>
            ) : (
              <>
                <List sx={{ py: 0, maxHeight: 300, overflow: 'auto' }}>
                  {cartItems.map((item) => {
                    const price = item.is_on_sale ? item.sale_price : item.price;
                    const quantity = item.quantity || 1;
                    return (
                      <ListItem key={item.id} sx={{ px: 0, py: 1 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.name}
                                {item.is_on_sale && (
                                  <Chip
                                    label="SALE"
                                    size="small"
                                    color="error"
                                    sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
                                  />
                                )}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Qty: {quantity}
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                ${(price * quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Box>

                <Link href="/cart" passHref legacyBehavior>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handlePopoverClose}
                  >
                    View Cart
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
