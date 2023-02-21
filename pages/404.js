import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { getResource } from "./api/getresource";
import Resource from "./resources/[id]/[[...page]]";

export default function Custom404() {
    const router = useRouter()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        console.log("404")
        async function fetchResource() {
            setLoading(true)
            // get the url in the form of /resources/[id]/[...page]
            // print the url and get each part of the url
            console.log(router.asPath)
            const url = router.asPath.split("/")
            if (url.length < 3 && url[1] !== "resources") {
                setError(true)
                router.push(`/404`)
            }
            const id = url[2]
            console.log(id)
            let resource = await getResource(id);
            console.log(resource)
            if (resource.error) {
                setError(true)
                // change url to 404 without reloading the page
                router.push(`/404`)
            }
            else
                setError(false)
            setLoading(false)
        }
        if (router.isReady && router.query !== undefined)
            fetchResource();
    }, [router, router.query.id, router.isReady])

    return (
        loading ? <div>Loading...</div> :
            <>
                {
                    error ?
                        <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
                            <h1 className="primary" style={{ fontSize: "10rem" }}>
                                404
                            </h1>
                            <p>The page you are looking for does not seem to exist.</p>
                            <Button variant="outline-primary" href="/">Home</Button>
                        </Container>
                        : <Resource />
                }
            </>
    );
}