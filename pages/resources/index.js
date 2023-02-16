import Head from 'next/head'
import { Container, SSRProvider } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getResources } from '../api/findresources'
import SearchBox from '@/components/searchbox'
import SearchResult from '@/components/searchresult'

export default function Resources({ resources }) {

    function Results() {
        if (resources.length === 0) {
            return (
                <>
                    <hr />
                    <div className='d-flex flex-column align-items-center justify-content-center p-5'>
                        <h1 className='text-muted'>No results found</h1>
                    </div >
                </>
            )
        }
        return (
            <div>
                {
                    resources.map((resource, index) => (
                        <div key={index} className='mt-5'>
                            <hr />
                            <SearchResult resource={resource} />
                        </div>
                    ))
                }
            </div>
        )
    }
    return (
        <SSRProvider>
            <Head>
                <title>gem5 resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className='d-flex flex-column gap-4 align-items-center'>
                <div className='p-5 w-100 bg-light'>
                    <SearchBox />
                </div>
                <div style={{ width: '60%' }} >
                    <Results />
                </div>
            </div>
            <Container className='d-flex flex-column gap-4 align-items-center'>
                <h1 className=' text-muted text-uppercase'>Gem5 Resources</h1>
                <div className='search-results'>
                    <SearchBox />
                    <Results />
                </div>
            </Container>
        </SSRProvider>
    )
}

export async function getServerSideProps({ query }) {
    if (!query.q) {
        query.q = ''
    }
    const resources = await getResources(query.q)
    return { props: { resources } };
};