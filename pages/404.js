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
        async function fetchResource(id) {
            setLoading(true)
            let resource = await getResource(id);
            if (resource.error) {
                setError(true)
                // change url to 404 without reloading the page
                router.push(`/404`)
            }
            else
                setError(false)
            setLoading(false)
        }
        // check if path 
        if (router.isReady && router.query !== undefined) {
            console.log(router.asPath)
            const url = router.asPath.split("/")
            console.log(url)
            if (url.length < 3 || url[1] !== "resources") {
                setError(true)
                setLoading(false)
                return
            }
            const id = url[2]
            console.log(id)
            fetchResource(id);
        }
    }, [router.isReady])

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