import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import CookieConsent from '@/components/cookieConsent'
import { useEffect, useState } from "react";
import CreatePR from "./createPR";

/**
 * @component
 * @description This component returns a footer section containing three columns with links to various resources related to gem5.
 * Along with that, it also creates a contributing to gem5 component below these columns.
 * @returns {JSX.Element} The JSX element representing the footer section.
 */
export default function Footer() {
  const [resetConsent, setResetConsent] = useState(false);

  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  function resetCookies() {
    gtag('consent', 'update', {
        'analytics_storage': 'denied'
    });

    localStorage.removeItem("CookieConsent");
    deleteCookie("_ga");
    deleteCookie("_ga_2B1F9HP95Z");

    setResetConsent(true);
  }

  return (
    <>
      <CookieConsent showConsentOverlay={resetConsent} hasUpdated={setResetConsent} />
      <div className="d-flex flex-column justify-content-center align-items-center bg-light mt-5">
        <Row className="h-100 w-75">
          <Col className="text-center primary d-flex flex-column h-100 pt-2 pb-2 gap-1 footer-col">
            <span className="text-muted main-text-regular">gem5 Resources</span>
            <Link href="/about" className="main-text-regular">About</Link>
            <Link href="https://www.gem5.org/publications/">Publications</Link>
            <Link href="https://www.gem5.org/contributing/">Contributing</Link>
            <Link href="https://www.gem5.org/governance/">Governance</Link>
          </Col>
          <Col className="text-center primary d-flex flex-column h-100 pt-2 pb-2 gap-1 footer-col">
            <span className="text-muted main-text-regular">Docs</span>
            <Link href="https://www.gem5.org/documentation/">
              Documentation
            </Link>
            <Link href="https://gem5.googlesource.com/public/gem5">Source</Link>
          </Col>
          <Col className="text-center primary d-flex flex-column h-100 pt-2 pb-2 gap-1 footer-col">
            <span className="text-muted main-text-regular">Help</span>
            <Link href="https://www.gem5.org/search/">Search</Link>
            <Link href="https://www.gem5.org/mailing_lists/">
              Mailing Lists
            </Link>
            <Link href="https://github.com/Gem5Vision/gem5-resources-website">
              Website Source
            </Link>
            <Button as='a' onClick={resetCookies} className="btn-variant-none" variant="none">Reset Cookies</Button>
          </Col>
        </Row>
        <Row className="w-100">
          <CreatePR />
        </Row>
      </div>
    </>
  );
}
