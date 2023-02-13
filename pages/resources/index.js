import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getResources } from '../api/findresources'
import Seachbox from '@/components/searchbox'

export default function Resources({ resources }) {
    const { query } = useRouter()

    return (
        <>
            <Head>
                <title>Gem5 resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container className='home'>
                <Seachbox />
                {resources.map((resource, index) => (
                    <p key={index} className='primary'>
                        <Link href={'/resources/' + resource.id}>
                            {resource.id}
                        </Link>
                    </p>
                ))}
            </Container>
        </>
    )
}

export async function getServerSideProps({ query }) {
    const resources = await getResources(query.q)
    return { props: { resources } };
};