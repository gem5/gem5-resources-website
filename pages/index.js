import Head from 'next/head'
import { Container, Button } from 'react-bootstrap'
import Seachbox from '@/components/searchBox'
import Image from 'next/image'
import logo from 'public/gem5ColorVert.png'
import { useRouter } from 'next/router'
import MyCards from '@/components/myCards'
import Link from "next/link";

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

  const gettingStartedCards = [
    {
      cardTitle: "riscv-ubuntu-20.04-boot",
      cardText: "A full boot of Ubuntu 20.04 with Linux 5.10 for RISCV.",
      pathRef: "riscv-ubuntu-20.04-boot",
      buttonText: "Learn More"  
    }, {
      cardTitle: "arm-hello64-static",
      cardText: "A 'Hello World!' binary, statically compiled to ARM 64 bit.",
      pathRef: "arm-hello64-static",
      buttonText: "Learn More"  
    }, {
      cardTitle: "x86-ubuntu-18.04-img",
      cardText: "A disk image containing Ubuntu 18.04 for x86.",
      pathRef: "x86-ubuntu-18.04-img",
      buttonText: "Learn More"  
    }
  ];

  const categoryCards = [
    {
      cardTitle: "Kernel",
      cardText: "A computer program that acts as the core of an operating system by managing system resources.",
      pathRef: "/category/kernel",
      buttonText: "Learn More"  
    }, {
      cardTitle: "Workload",
      cardText: "Bundles of resources and any input parameters.",
      pathRef: "/category/workload",
      buttonText: "Learn More"  
    }, {
      cardTitle: "Benchmark",
      cardText: "A program that is used to test the performance of a computer system.",
      pathRef: "/category/benchmark",
      buttonText: "Learn More"  
    }
  ];

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
        <p className='primary mt-5 text-center main-text-regular'>
          gem5 resources is a repository providing sources for artifacts known and proven compatible with the gem5 architecture simulator. These resources are not necessary for the compilation or running of gem5, but may aid users in producing certain simulations
        </p>
        <div className='cardsBlockContainer mt-5'>
          <h2 className='primary page-title'>Getting Started</h2>
          <p className='text-muted main-text-regular'>First time using gem5? These resources might help.</p>
          <div className='cardsContainer'>
            {gettingStartedCards.map((card, index) => (
              <MyCards className="cardStyle" key={index} cardTitle={card.cardTitle} cardText={card.cardText} pathRef={card.pathRef} buttonText={card.buttonText} />
            ))}
          </div>
          <Link href="/resources/?q=" passHref={true} style={{ alignSelf: 'flex-end' }} className="mt-3">
            <Button variant="outline-primary" className="main-text-regular">View All</Button>
          </Link>
        </div>
        <div className='cardsBlockContainer mt-5 mb-5'>
          <h2 className='primary page-title'>Categories</h2>
          <p className='text-muted main-text-regular'>These are the "Categories" of Resources we use on this website.</p>
          <div className='cardsContainer'>
            {categoryCards.map((card, index) => (
                <MyCards className="cardStyle" key={index} cardTitle={card.cardTitle} cardText={card.cardText} pathRef={card.pathRef} buttonText={card.buttonText} />
            ))}
          </div>
          <Link href="/category" passHref={true} style={{ alignSelf: 'flex-end' }} className="mt-3">
            <Button variant="outline-primary" className="main-text-regular">View All</Button>
          </Link>
        </div>
      </Container>
    </>
  )
}
