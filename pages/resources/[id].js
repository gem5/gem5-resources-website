import MetaData from '@/components/resource-metadata'
import Banner from '@/components/resource-banner'
import Head from 'next/head'
import { Row, Col, Container } from 'react-bootstrap'
import { SSRProvider } from "@react-aria/ssr";
import { getResource } from '../api/getresource'
import ResourceTab from '@/components/resource-tab'

export default function Resource({ resource }) {
    return (
        <SSRProvider>
            <Head>
                <title>gem5 resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container className='mt-5'>
                <Row>
                    <Banner resource={resource} />
                </Row>
                <Row>
                    <Col>
                        <ResourceTab resource={resource} />
                    </Col>
                    <Col>
                        <MetaData resource={resource} />
                    </Col>
                </Row>
            </Container>
        </SSRProvider >
    )
}

export async function getServerSideProps(ctx) {
    const id = ctx.params.id
    ctx.res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
    let resource = await getResource(id)
    if (resource.error) {
        return {
            notFound: true,
        };
    }

    return { props: { resource } };
};