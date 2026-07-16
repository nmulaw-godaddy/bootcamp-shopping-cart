import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const { nextRedux } = require('../redux/store');
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import Layout from '../components/Layout';
import { AuthProvider } from '../components/AuthContext';
import LoadingDoughnut from '../components/LoadingDoughnut';
import Box from '@mui/material/Box';
import '../styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css'

function WrappedApp({ Component, pageProps }) {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (splash) {
    return (
      <AppCacheProvider>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgb(12,51,84)' }}>
          <LoadingDoughnut size={200} />
        </Box>
      </AppCacheProvider>
    );
  }

  return (
    <AppCacheProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
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
