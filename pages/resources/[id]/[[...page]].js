import MetaData from '@/components/resource-metadata'
import Banner from '@/components/resource-banner'
import Head from 'next/head'
import { Row, Col, Container } from 'react-bootstrap'
import { getResource } from '../../api/getresource'
import ResourceTab from '@/components/resource-tab'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * @component
 * @description The resource page. This page is used to display the resource page for a specific resource.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
function Resource() {
    const [resource, setResource] = useState([])
    const [loading, setLoading] = useState(true)
    const [showMetadata, setShowMetadata] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const router = useRouter()

    useEffect(() => {
        console.log("Resource Page")
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
            const url = router.asPath.split("/")
            const id = url[2]
            console.log(id)
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
        loading ? <div></div> :
            <>
                <Head>
                    <title>{resource.id}</title>
                    <meta name="description" content="Find the resource you need" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                {showMetadata && isTablet ? <MetaData resource={resource ?? {}} showMetadata={showMetadata} setShowMetadata={setShowMetadata}/>:
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