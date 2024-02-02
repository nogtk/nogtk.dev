import { AppProps } from 'next/app'
import { useEffect } from 'react';
import '../styles/index.css'
import 'zenn-content-css';
import { DefaultSeo } from 'next-seo';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("zenn-embed-elements");
  }, []);
  return (
    <>
      <DefaultSeo
        titleTemplate = '%s | nogtk.dev'
        defaultTitle = 'nogtk.dev'
        description = "Tech insights, with a sprinkle of life's adventures"
        twitter = {{
          cardType: 'summary_large_image',
          site: 'nogtk.dev',
          handle: '@_nogtk_',
        }}
        openGraph = {{
          type: 'website',
          url: 'https://nogtk.dev',
          title: 'nogtk.dev',
          description: "Tech insights, with a sprinkle of life's adventures",
          locale: 'ja_JP',
          siteName: 'nogtk.dev',
          images: [
            {
              url: 'https://res.cloudinary.com/di1lterwq/image/upload/v1692798736/Frame_1_pt3mzq.png'
            }
          ]
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
