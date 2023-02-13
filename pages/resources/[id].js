import Banner from '@/components/resource/banner'
import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { getResource } from '../api/getresource'

export default function Resource({ resource }) {
    return (
        <>
            <Head>
                <title>gem5 resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container className='home'>
                <Banner resource={resource} />
            </Container>
        </>
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