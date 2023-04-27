import { Container, Navbar, Nav, Offcanvas } from "react-bootstrap";
import Image from "next/image";
import logo from "public/gem5ColorLong.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBox from "./searchBox";
import { useRouter } from "next/router";

/**
 * @component
 * @description This component returns the top navigation bar for the gem5 website.
 * It includes a logo, a toggle button for small screens, and an offcanvas menu with links to Home, About, and Documentation pages.
 * @returns {JSX.Element} The JSX element representing the top navigation bar.
*/
export default function Topbar() {
    const [show, setShow] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (router.pathname.includes("/resources/")) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [router.pathname]);

    return (
        <>
            <Navbar bg="light" className="shadow-sm" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/" as={Link}>
                        <Image
                            src={logo}
                            alt="Gem5 Logo"
                            height={55}
                            priority
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-sm`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                Gem5 Resources
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                {show ?
                                    <div className="topbar-search">
                                        <SearchBox />
                                    </div>
                                    : null}
                                <Nav.Link href="/" as={Link} className="main-text-regular">Home</Nav.Link>
                                <Nav.Link href="/about" as={Link} className="main-text-regular">About</Nav.Link>
                                <Nav.Link href="/category" as={Link} className="main-text-regular">Categories</Nav.Link>
                                <Nav.Link href="/help" as={Link} className="main-text-regular">Help</Nav.Link>
                                <Nav.Link href="https://www.gem5.org/documentation/general_docs/gem5_resources/" as={Link} className="main-text-regular">Documentation</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )
}