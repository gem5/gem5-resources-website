import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Container } from 'react-bootstrap'
import Seachbox from '@/components/searchbox'
import Image from 'next/image'
import logo from 'public/gem5ColorVert.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Gem5 resources</title>
        <meta name="description" content="Find the resource you need" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container className='home'>
        <Image
          src={logo}
          alt="Gem5 Logo"
          height={250}
        />
        <h1 className='primary mb-5'>Resources</h1>
        <Seachbox />
        <p className='primary mt-5 text-center'>
          gem5 resources is a repository providing sources for artifacts known and proven compatible with the gem5 architecture simulator. These resources are not necessary for the compilation or running of gem5, but may aid users in producing certain simulations
        </p>
      </Container>
    </>
  )
}
