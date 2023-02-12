import { Container, Navbar, Nav } from "react-bootstrap";
import Image from "next/image";
import logo from "public/gem5ColorLong.gif";
export default function Topbar() {
    return (
        <>
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand href="/">
                        <Image
                            src={logo}
                            alt="Gem5 Logo"
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