import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Resources() {
    const { query } = useRouter()

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
                    <Link href={'/resources/' + query.q}>
                        {query.q}
                    </Link>
                </p>
            </Container>
        </>
    )
}