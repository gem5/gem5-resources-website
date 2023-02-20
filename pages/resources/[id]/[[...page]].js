import MetaData from '@/components/resource-metadata'
import Banner from '@/components/resource-banner'
import Head from 'next/head'
import { Row, Col, Container } from 'react-bootstrap'
import { SSRProvider } from "@react-aria/ssr";
import { getResource } from '../../api/getresource'
import ResourceTab from '@/components/resource-tab'
import { fetchResources, fetchResourcesJSON } from '../../api/resources'

function Resource({ resource }) {
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

export async function getStaticPaths() {
    const resources = await fetchResources();
    // create paths for all /resources/[id]/[...page]
    const paths = resources.map((resource) => ({
        params: {
            id: resource.id.toString(),
            page: ['']
        },
    }))
    /* const paths = [
    ] */
    return { paths, fallback: true }
}



// export async function getServerSideProps(ctx) {
export async function getStaticProps(ctx) {
    // Resource.getInitialProps = async (ctx) => {
    const id = ctx.params.id
    // const id = ctx.query.id
    // ctx.res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
    let resource = await getResource(id);
    if (resource.error) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            resource: resource,
        }
    };
};

export default Resource