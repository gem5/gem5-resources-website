import '@/styles/globals.css'
import Layout from '@/components/layout'
import Router from 'next/router'
import { useEffect } from 'react'
import NProgress from 'nprogress';
import Script from 'next/script';

NProgress.configure({ showSpinner: false });

/**
 * @component
 * @description The main component of the application. It is used to initialize the application.
 * @param {Object} Component The component to be rendered.
 * @param {Object} pageProps The props of the component to be rendered.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function App({ Component, pageProps }) {
  useEffect(() => {
    const start = () => {
      NProgress.start();
    };
    const end = () => {
      NProgress.done();
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, [])

  return (
    <>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-2B1F9HP95Z" />
      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-2B1F9HP95Z')
`,
        }}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
