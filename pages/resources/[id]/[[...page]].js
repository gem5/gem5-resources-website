import MetaData from '@/components/resource-metadata'
import Banner from '@/components/resource-banner'
import Head from 'next/head'
import { Row, Col, Container } from 'react-bootstrap'
import { SSRProvider } from "@react-aria/ssr";
import { getResource } from '../../api/getresource'
import ResourceTab from '@/components/resource-tab'
import { fetchResources } from '../../api/resources'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Resource() {
    const [resource, setResource] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function fetchResource() {
            const id = router.query.id
            let resource = await getResource(id);
            setResource(resource);
        }
        fetchResource();
    }, [router.query.id])

    return (
        <SSRProvider>
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
        </SSRProvider >
    )
}

export default Resource