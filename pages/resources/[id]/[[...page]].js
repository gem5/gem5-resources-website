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
        async function fetchResource(id) {
            setLoading(true)
            let resource = await getResource(id);
            console.log(resource)
            if (resource.error) {
                router.push(`/404`)
            }
            else
                setResource(resource)
            setLoading(false)
        }
        if (router.isReady && router.query !== undefined) {
            const id = router.query.id
            console.log(id)
            fetchResource(id);
        }
    }, [router.query.id, router.isReady])

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