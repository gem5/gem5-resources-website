import Link from "next/link";
import { Container, Row, Col, Placeholder } from "react-bootstrap";
import styles from '/styles/metadata.module.css'
import { useEffect, useState } from 'react';

/**
 * @component
 * @description A component that renders the metadata of a resource that includes
 *             the number of likes, views, downloads, author, description, license,
 *            dependencies, and depend on this resource.
 * @param {Object} resource The resource object.
 * @param {string} className The class name of the component.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function MetaData({ resource, className, showMetadata, setShowMetadata }) {
    const [currentStyle, setCurrentStyle] = useState(styles.info)

    useEffect(() => {
        showMetadata ? setCurrentStyle(styles.active) : setCurrentStyle(styles.info)
    }, [showMetadata])

    return (
        Object.keys(resource).length === 0 ?
            <Container className={currentStyle + ' ' + className}>
                <Row className="border-bottom">
                    <Col className="border-end">
                        <div>
                            <Placeholder as="h5" animation="glow" style={{ width: '40px' }}>
                                <Placeholder xs={12} />
                            </Placeholder>
                            <p className="text-muted">LIKES</p>
                        </div>
                    </Col>
                    <Col className="border-end">
                        <div>
                            <Placeholder as="h5" animation="glow" style={{ width: '40px' }}>
                                <Placeholder xs={12} />
                            </Placeholder>
                            <p className="text-muted">VIEWS</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <Placeholder as="h5" animation="glow" style={{ width: '40px' }}>
                                <Placeholder xs={12} />
                            </Placeholder>
                            <p className="text-muted">DOWNLOADS</p>
                        </div>
                    </Col>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Author</p>
                    <Placeholder as="h4" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Description</p>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">License</p>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Properties</p>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Depend on this resource</p>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
            </Container >
            :
            <>
                <Container className={currentStyle + ' ' + className}>
                    <Row className={styles.tablet_view_header}>
                        <Col className={styles.back_button_col}>
                            <button className={styles.collapse_metadata} onClick={() => { setShowMetadata(false) }}>
                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" stroke='#0095AF'><path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" /></svg>
                            </button>
                        </Col>
                        <Col className={styles.metadata_title_col}>
                            <h2 className="primary">Metadata</h2>
                        </Col>
                    </Row>
                    <Row className="border-bottom">
                        <Col className="border-end">
                            <div>
                                <h5 className="primary">
                                    {Math.floor(Math.random() * 100)}
                                </h5>
                                <p className="text-muted">LIKES</p>
                            </div>
                        </Col>
                        <Col className="border-end">
                            <div>
                                <h5 className="primary">
                                    {Math.floor(Math.random() * 10000)}
                                </h5>
                                <p className="text-muted">VIEWS</p>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <h5 className="primary">
                                    {Math.floor(Math.random() * 100)}
                                </h5>
                                <p className="text-muted">DOWNLOADS</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="border-bottom">
                        <p className="text-muted">Author</p>
                        <h4 className="primary">
                            {resource.author ? resource.author.map((author, index) => {
                                return (
                                    <span key={index}>
                                        {author}
                                        {index < resource.author.length - 1 ? ', ' : ''}
                                    </span>
                                )
                            }) : 'Unknown'}
                        </h4>
                    </Row>
                    <Row className="border-bottom">
                        <p className="text-muted">Description</p>
                        <p className="">
                            {resource.description ?? 'This is a description of the resource.'}
                        </p>
                        {
                            resource.github_url ?
                                <Link
                                    href={resource.github_url}
                                >
                                    Repository (GitHub)
                                </Link> : null
                        }
                    </Row>
                    <Row className="border-bottom">
                        <p className="text-muted">License</p>
                        <p className="">
                            {resource.license ?? 'Unknown'}
                            {" "}
                            {
                                resource.license ? <>
                                    (
                                    < Link
                                        href={'https://gem5.googlesource.com/public/gem5/+/refs/heads/stable/LICENSE'}
                                    >
                                        LICENSE
                                    </Link>
                                    )
                                </> : null

                            }
                        </p>
                    </Row>
                    <Row className="border-bottom">
                        <p className="text-muted">Properties</p>
                        <p className="">
                            {
                                resource.resources ? Object.keys(resource.resources).map((key, index) => {
                                    return (
                                        <div key={key}>
                                            <span className="text-muted">{key + ": "}</span>
                                            <a href={'/gem5-resources-website/resources/' + resource.resources[key]}>
                                                {resource.resources[key]}
                                            </a>
                                        </div>
                                    )
                                }) : 'None'
                            }
                        </p>
                    </Row>
                    <Row className="border-bottom">
                        <p className="text-muted">Depend on this resource</p>
                        <p className="">
                            {
                                (resource.workloads && resource.workloads.length > 0) ? resource.workloads.map((workload, index) => {
                                    return (
                                        <span key={workload}>
                                            <a
                                                href={'/gem5-resources-website/resources/' + workload}
                                            >
                                                {workload}
                                            </a>
                                            {index != resource.workloads.length - 1 ? ', ' : ''}
                                        </span>
                                    )
                                }) : 'None'
                            }
                        </p>
                    </Row>
                </Container >
            </>
    )
}