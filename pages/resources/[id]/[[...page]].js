import MetaData from '@/components/resourceMetadata'
import Banner from '@/components/resourceBanner'
import Head from 'next/head'
import { Row, Col, Container } from 'react-bootstrap'
import { getResource } from '../../api/getresource'
import ResourceTab from '@/components/resourceTab'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import getTabs from '@/pages/api/getTabs'

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
    const [requiredTabs, setRequiredTabs] = useState([]);
    const [additionalInfoTabs, setAdditionalInfoTabs] = useState([]);
    const [metaFields, setMetaFields] = useState([]);
    const router = useRouter()

    useEffect(() => {
        if (Object.keys(resource).length === 0) return;
        getTabs(resource).then((fields) => {
            setRequiredTabs(fields.required);
            setAdditionalInfoTabs(fields.additionalInfo);
            setMetaFields(fields.meta);
        });
    }, [resource]);

    const [id, setId] = useState(null);
    const [database, setDatabase] = useState(null);
    const [version, setVersion] = useState(null);

    useEffect(() => {
        if (router.isReady && (id === null || database === null || version === null)) {
            const url = router.asPath.split('#')[0].split('?')[0].split('/')
            if (url.includes("resources")) {
                setId(url[url.indexOf("resources") + 1])
            }
            let params = []
            if (router.asPath.includes('?')) {
                params = router.asPath.split('#')[0].split('?')[1].split('&')
            }
            params.forEach(param => {
                const [key, value] = param.split('=')
                if (key === 'database') {
                    setDatabase(value)
                }
                else if (key === 'version') {
                    setVersion(value)
                }
            })
        }
    }, [router.isReady])

    useEffect(() => {
        async function fetchResource() {
            setLoading(true)
            let resource;
            resource = await getResource(id, database, version)
            if (resource.error) {
                window.location.replace(process.env.BASE_PATH + "/404")
            } else {
                setResource(resource)
            }
            setLoading(false)
        }
        if (id !== null) {
            fetchResource();
        }
    }, [id, database, version])

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
                        <ResourceTab resource={resource ?? {}} requiredTabs={requiredTabs} additionalInfoTabs={additionalInfoTabs} />
                        <MetaData resource={resource ?? {}} className='ms-5' metaFields={metaFields} />
                    </Row>
                </Container>
            }
        </>
    )
}

export default Resource