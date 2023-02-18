import { Button, Container } from "react-bootstrap";

export default function Custom404() {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
            <h1 className="primary" style={{ fontSize: "10rem" }}>
                404
            </h1>
            <p>The page you are looking for does not seem to exist.</p>
            <Button variant="outline-primary" href="/gem5-resources-website/">Home</Button>
        </Container>
    );
}