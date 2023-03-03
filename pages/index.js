import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Container } from 'react-bootstrap'
import Seachbox from '@/components/searchbox'
import Image from 'next/image'
import logo from 'public/gem5ColorVert.png'
import { useRouter } from 'next/router'
import { useState } from 'react'
import MyCards from '@/components/cards'
const inter = Inter({ subsets: ['latin'] })

/**
 * @component
 * @description The home page of the website.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function Home() {
  const router = useRouter()
  function onSearch(query) {
    router.push({
      pathname: '/resources',
      query: { q: query }
    })
  }

  return (
    <>
      <Head>
        <title>gem5 resources</title>
        <meta name="description" content="Find the resource you need" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container className='d-flex flex-column align-items-center justify-content-center home mt-5'>
        <Image
          src={logo}
          alt="Gem5 Logo"
          height={250}
          className='gem5-logo'
          priority
        />
        <h1 className='primary mb-5'>Resources</h1>
        <Seachbox callback={onSearch} />
        <p className='primary mt-5 text-center'>
          gem5 resources is a repository providing sources for artifacts known and proven compatible with the gem5 architecture simulator. These resources are not necessary for the compilation or running of gem5, but may aid users in producing certain simulations
        </p>
        <MyCards />
      </Container>
    </>
  )
}
