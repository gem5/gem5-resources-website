import { Container, Navbar, Nav } from "react-bootstrap";
import Image from "next/image";
export default function Topbar() {
    return (
        <>
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand href="/">
                        <Image
                            src="/gem5ColorLong.gif"
                            alt="Gem5 Logo"
                            width={137}
                            height={55}
                        />
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/hello/test">Test</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}