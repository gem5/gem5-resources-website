import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { useEffect, useState } from 'react'

export default function Resources() {
    const [query, setQuery] = useState('')
    useEffect(() => {
        setQuery(window.location.search.substring(3).replace(/%20/g, ' '))
    }, [])
    return (
        <>
            <Head>
                <title>Gem5 resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container className='home'>
                <h1 className='primary mb-5'>Resources</h1>
                <p className='primary'>
                    {query}
                </p>
            </Container>
        </>
    )
}