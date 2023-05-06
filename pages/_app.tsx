import { AppProps } from 'next/app'
import { useEffect } from 'react';
import '../styles/index.css'
import 'zenn-content-css';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("zenn-embed-elements");
  }, []);
  return <Component {...pageProps} />
}
