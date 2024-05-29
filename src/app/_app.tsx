// _app.tsx
import { AppProps } from 'next/app';
import {WalletProvider} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { StrictMode } from "react";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;
