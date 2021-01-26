import 'reset.css';
import '../styles/globals.scss';
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';

function Layout({ Component, pageProps }) {
  return (
    <div id="app">
      <Component { ...pageProps } />
    </div>
  );
}

export default Layout;
