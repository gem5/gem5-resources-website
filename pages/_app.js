import '@/styles/globals.css'
import Head from 'next/head'
import Layout from '@/components/layout'
import Router from 'next/router'
import { useEffect } from 'react'
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

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
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/gem5-resources-website/favicon.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
