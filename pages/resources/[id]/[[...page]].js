import MetaData from '@/components/resourceMetadata'
import Banner from '@/components/resourceBanner'
import Head from 'next/head'
import { Row, Col, Container } from 'react-bootstrap'
import { getResource } from '../../api/getresource'
import ResourceTab from '@/components/resourceTab'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * @component
 * @description The resource page. This page is used to display the resource page for a specific resource.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
function Resource() {
    const [resource, setResource] = useState({})
    const [loading, setLoading] = useState(true)
    const [showMetadata, setShowMetadata] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchResource(id) {
            // if contains query string database, then it is a private resource
            let database = null
            if (router.query.database !== undefined) {
                database = router.query.database
            }
            setLoading(true)
            let resource;
            if (router.query.version !== undefined) {
                // let resource = await getResource(id, database, "1.0.0")
                resource = await getResource(id, database, router.query.version)
            }
            else {
                resource = await getResource(id, database)
            }
            if (resource.error) {
                // trigger replace current page with 404 page
                window.location.replace(process.env.BASE_PATH + "/404")
            }
            else
                setResource(resource)
            setLoading(false)
        }
        if (router.isReady && router.query !== undefined) {
            let i = 2
            const url = router.asPath.split('?')[0].split("/")
            const id = url[i]
            fetchResource(id);
        }
    }, [router.isReady])

    useEffect(() => {
        function onTabletResize() { window.innerWidth <= 768 ? setIsTablet(true) : setIsTablet(false); }
        onTabletResize();
        window.addEventListener("resize", onTabletResize);
        return () => { window.removeEventListener("resize", onTabletResize) }
    }, [])

    return (
        <>
            <Head>
                <title>{resource.id}</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            {showMetadata && isTablet ? <MetaData resource={resource ?? {}} showMetadata={showMetadata} setShowMetadata={setShowMetadata} /> :
                <Container className='mt-5 resources_page_container'>
                    <Row>
                        <Banner resource={resource ?? {}} setShowMetadata={setShowMetadata} />
                    </Row>
                    <Row>
                        <ResourceTab resource={resource ?? {}} />
                        <MetaData resource={resource ?? {}} className='ms-5' />
                    </Row>
                </Container>
            }
        </>
    )
}

export default Resource