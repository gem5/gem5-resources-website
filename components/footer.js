import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import CreatePR from "./createPR";

/**
 * @component
 * @description This component returns a footer section containing three columns with links to various resources related to gem5.
 * @returns {JSX.Element} The JSX element representing the footer section.
 */
export default function Footer() {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center bg-light mt-5">
        <Row className="h-100 w-75">
          <Col className="text-center primary d-flex flex-column h-100 pt-2 pb-2 gap-1">
            <span className="text-muted">gem5 Resources</span>
            <Link href="/about">About</Link>
            <Link href="https://www.gem5.org/publications/">Publications</Link>
            <Link href="https://www.gem5.org/contributing/">Contributing</Link>
            <Link href="https://www.gem5.org/governance/">Governance</Link>
          </Col>
          <Col className="text-center primary d-flex flex-column h-100 pt-2 pb-2 gap-1">
            <span className="text-muted">Docs</span>
            <Link href="https://www.gem5.org/documentation/">
              Documentation
            </Link>
            <Link href="https://gem5.googlesource.com/public/gem5">Source</Link>
          </Col>
          <Col className="text-center primary d-flex flex-column h-100 pt-2 pb-2 gap-1">
            <span className="text-muted">Help</span>
            <Link href="https://www.gem5.org/search/">Search</Link>
            <Link href="https://www.gem5.org/mailing_lists/">
              Mailing Lists
            </Link>
            <Link href="https://github.com/Gem5Vision/gem5-resources-website">
              Website Source
            </Link>
          </Col>
        </Row>
        <Row>
          <CreatePR />
        </Row>
      </div>
    </>
  );
}
