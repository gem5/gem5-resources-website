import Head from 'next/head'
import { Container, Button } from 'react-bootstrap'
import Seachbox from '@/components/searchBox'
import Image from 'next/image'
import logo from 'public/gem5ColorVert.png'
import { useRouter } from 'next/router'
import MyCards from '@/components/myCards'
import Link from "next/link";
import { useEffect, useState } from 'react'

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
      pathRef: "resources/riscv-ubuntu-20.04-boot",
      buttonText: "Learn More"
    }, {
      cardTitle: "arm-hello64-static",
      cardText: "A 'Hello World!' binary, statically compiled to ARM 64 bit.",
      pathRef: "resources/arm-hello64-static",
      buttonText: "Learn More"
    }, {
      cardTitle: "x86-ubuntu-18.04-img",
      cardText: "A disk image containing Ubuntu 18.04 for x86.",
      pathRef: "resources/x86-ubuntu-18.04-img",
      buttonText: "Learn More"
    }
  ];

  const [categoryCards, setCategoryCards] = useState([]);

  useEffect(() => {
    fetch(process.env.SCHEMA_URL)
      .then(res => res.json())
      .then(data => {
        const categoryCards = []
        for (let i = 0; i < 3; i++) {
          const category = data['properties']['category']['enum'][i]
          categoryCards.push({
            cardTitle: category.charAt(0).toUpperCase() + category.substr(1).toLowerCase(),
            cardText: data['definitions'][category]['description'],
            pathRef: `/category#${category}`,
            buttonText: "Learn More"
          })
        }
        setCategoryCards(categoryCards);
      })
  }, [])

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
          alt="gem5 Logo"
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
          <div className='cardsContainer' aria-label="Getting Started Cards">
            {gettingStartedCards.map((card, index) => (
              <MyCards className="cardStyle" key={index} cardTitle={card.cardTitle} cardText={card.cardText} pathRef={card.pathRef} buttonText={card.buttonText} />
            ))}
          </div>
          <Link href="/resources/?q=" passHref={true} legacyBehavior={true}>
            <Button variant="outline-primary" style={{ alignSelf: 'flex-end' }} className="mt-3 main-text-regular">View All</Button>
          </Link>
        </div>
        <div className='cardsBlockContainer mt-5 mb-5'>
          <h2 className='primary page-title'>Categories</h2>
          <p className='text-muted main-text-regular'>These are the "Categories" of Resources we use on this website.</p>
          <div className='cardsContainer' aria-label="Category Cards">
            {categoryCards.map((card, index) => (
              <MyCards className="cardStyle" key={index} cardTitle={card.cardTitle} cardText={card.cardText} pathRef={card.pathRef} buttonText={card.buttonText} />
            ))}
          </div>
          <Link href="/category" passHref={true} legacyBehavior={true}>
            <Button variant="outline-primary" style={{ alignSelf: 'flex-end' }} className="mt-3 main-text-regular">View All</Button>
          </Link>
        </div>
      </Container>
    </>
  )
}
