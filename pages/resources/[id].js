import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { getResource } from '../api/getresource'

export default function Resource({ resource }) {
    return (
        <>
            <Head>
                <title>Gem5 resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container className='home'>
                <h1 className='primary mb-5'>Resource</h1>
                <p className='primary'>
                    {resource.id}
                </p>
                <p className='primary'>
                    {resource.content}
                </p>
            </Container>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const id = ctx.params.id
    let resource = await getResource(id)
    if (resource.error) {
        return {
            notFound: true,
        };
    }

    return { props: { resource } };
};