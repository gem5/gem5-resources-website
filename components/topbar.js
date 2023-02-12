import { Container, Navbar, Nav } from "react-bootstrap";
import Image from "next/image";
import logo from "public/gem5ColorLong.gif";
import Link from "next/link";

export default function Topbar() {
    return (
        <>
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand href="/" as={Link}>
                        <Image
                            src={logo}
                            alt="Gem5 Logo"
                            height={55}
                        />
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/" as={Link}>Home</Nav.Link>
                        <Nav.Link href="/about" as={Link}>About</Nav.Link>
                        <Nav.Link href="/hello/test" as={Link}>Test</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}