import Link from "next/link";
import { Container, Row, Col, Placeholder } from "react-bootstrap";
import styles from '/styles/metadata.module.css'
import { useEffect, useState } from 'react';
import { createTab } from "./resourceTab";

/**
 * @component
 * @description A component that renders the metadata of a resource that includes
 *             author, description, license,
 *            dependencies, and depend on this resource.
 * @param {Object} resource The resource object.
 * @param {string} className The class name of the component.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function MetaData({ resource, className, metaFields, showMetadata, setShowMetadata }) {
    const [currentStyle, setCurrentStyle] = useState(styles.info)

    useEffect(() => {
        showMetadata ? setCurrentStyle(styles.active) : setCurrentStyle(styles.info)
    }, [showMetadata])

    return (
        Object.keys(resource).length === 0 ?
            <Container className={currentStyle + ' ' + className}>
                <Row className="border-bottom">
                    <p className="text-muted main-text-regular">Author</p>
                    <Placeholder as="h4" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted main-text-regular">Description</p>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted main-text-regular">License</p>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted main-text-regular">Properties</p>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted main-text-regular">Depend on this resource</p>
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
                        <p className="text-muted main-text-regular">Author</p>
                        <h4 className="primary main-text-title-bold">
                            {resource.author.length > 0 ? resource.author.map((author, index) => {
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
                        <p className="text-muted main-text-regular">Description</p>
                        <p className="main-text-regular">
                            {resource.description ?? 'This is a description of the resource.'}
                        </p>
                        {
                            resource.source_url ?
                                <Link
                                    href={resource.source_url}
                                    className="main-text-regular"
                                >
                                    Repository (GitHub)
                                </Link> : null
                        }
                    </Row>
                    <Row className="border-bottom">
                        <p className="text-muted main-text-regular">License</p>
                        <p className="main-text-regular">
                            {
                                resource.license == "" ? 'Unknown' : <>
                                    {" "}
                                    < Link
                                        href={'https://gem5.googlesource.com/public/gem5/+/refs/heads/stable/LICENSE'}
                                    >
                                        {resource.license}
                                    </Link>
                                </>
                            }
                        </p>
                    </Row>
                    {
                        resource.resources ?
                            <Row className="border-bottom">
                                <p className="text-muted main-text-regular">Properties</p>
                                <div className="main-text-regular">
                                    {Object.keys(resource.resources).map((key, index) => {
                                        return (
                                            <div key={key}>
                                                <div>
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </div>
                                                <a href={process.env.BASE_PATH + '/resources/' + resource.resources[key] + `?database=${resource.database}`} style={{ display: 'block', paddingTop: '0.0625rem' }}>
                                                    {resource.resources[key]}
                                                </a>
                                            </div>
                                        );
                                    })
                                    }
                                </div>
                            </Row>
                            : null
                    }
                    {
                        (resource.workloads && resource.workloads.length > 0) ?
                            <Row className="border-bottom">
                                <p className="text-muted main-text-regular">Depend on this resource</p>
                                <div className="main-text-regular">
                                    {
                                        resource.workloads.map((workload, index) => {
                                            return (
                                                <span key={workload}>
                                                    <a
                                                        href={process.env.BASE_PATH + '/resources/' + workload + `?database=${resource.database}`}
                                                    >
                                                        {workload}
                                                    </a>
                                                    {index != resource.workloads.length - 1 ? ', ' : ''}
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            </Row>
                            : null
                    }
                    {
                        metaFields && metaFields.map((field, index) => {
                            const content = createTab(field)
                            if (content == null) return null
                            return (
                                <Row key={index} className="border-bottom">
                                    <p className="text-muted main-text-regular">{field.displayName ?? field.name}</p>
                                    <div className="main-text-regular">
                                        {content}
                                    </div>
                                </Row>
                            )
                        })
                    }
                </Container >
            </>
    )
}