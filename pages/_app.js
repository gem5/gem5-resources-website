import '@/styles/globals.css'
import Head from 'next/head'
import Layout from '@/components/layout'
import Router from 'next/router'
import { Suspense, useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setLoading(true)
      NProgress.start();
    })

    Router.events.on('routeChangeComplete', () => {
      setLoading(false)
      NProgress.done();
    })

    Router.events.on('routeChangeError', () => {
      setLoading(false)
      NProgress.done();
    })
  }, [Router])

  return (
    <>
      {/* {loading && (
        <div className="spinner">
          <Spinner animation="border" role="status" />
        </div>)} */}
      <Head>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/nprogress@0.2.0/nprogress.css" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
