import { AppProps } from 'next/app'
import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/index.css'
import 'zenn-content-css';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("zenn-embed-elements");
  }, []);
  return (
    <>
      <Head>
        <title>nogtk.dev</title>
        <meta key="description" name="description" content="技術のメモと、日々の記録" />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="nogtk.dev" />
        <meta key="twitter:creator" name="twitter:creator" content="@_nogtk_" />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:url" property="og:url" content="https://nogtk.dev" />
        <meta key="og:title" property="og:title" content="nogtk.dev" />
        <meta key="og:description" property="og:description" content="技術のメモと、日々の記録" />
        <meta key="og:locale" property="og:locale" content="ja_JP" />
        <meta key="og:site_name" property="og:site_name" content="nogtk.dev" />
        <meta
          key="og:image"
          property="og:image"
          content="https://res.cloudinary.com/di1lterwq/image/upload/v1692798736/Frame_1_pt3mzq.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
