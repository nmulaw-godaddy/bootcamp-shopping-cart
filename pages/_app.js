import React from 'react';
import PropTypes from 'prop-types';
const { nextRedux } = require('../redux/store');
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '../components/Layout';
import { AuthProvider } from '../components/AuthContext';
import theme from '../theme';
import '../styles.css'

function WrappedApp({ Component, pageProps }) {
  return (
    <AppCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}

WrappedApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object
};

export default [
  nextRedux.withRedux,
].reduce((cmp, hoc) => hoc(cmp), WrappedApp);
