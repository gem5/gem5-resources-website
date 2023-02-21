import MetaData from '@/components/resource-metadata'
import Banner from '@/components/resource-banner'
import Head from 'next/head'
import { Row, Col, Container } from 'react-bootstrap'
import { getResource } from '../../api/getresource'
import ResourceTab from '@/components/resource-tab'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Resource() {
    const [resource, setResource] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        console.log("404")
        async function fetchResource() {
            setLoading(true)
            // get the url in the form of /resources/[id]/[...page]
            // print the url and get each part of the url
            console.log(router.asPath)
            const url = router.asPath.split("/")
            const id = url[2]
            console.log(id)
            let resource = await getResource(id);
            console.log(resource)
            if (resource.error) {
                router.push(`/404`)
            }
            else
                setResource(resource)
            setLoading(false)
        }
        if (router.isReady && router.query !== undefined)
            fetchResource();
    }, [router, router.query.id, router.isReady])

    return (
        loading ? <div>Loading...</div> :
            <>
                <Head>
                    <title>gem5 resources</title>
                    <meta name="description" content="Find the resource you need" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Container className='mt-5'>
                    <Row>
                        <Banner resource={resource ?? {}} />
                    </Row>
                    <Row>
                        <ResourceTab resource={resource ?? {}} />
                        <MetaData resource={resource ?? {}} className='ms-5' />
                    </Row>
                </Container>
            </>
    )
}

export default Resource