import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import styles from '/styles/metadata.module.css'
export default function MetaData({ resource, className }) {
    return (
        <>
            <Container className={styles.info + ' ' + className}>
                <Row className="border-bottom">
                    <Col className="border-end">
                        <div>
                            <h5 className="primary">9001</h5>
                            <p className="text-muted">LIKES</p>
                        </div>
                    </Col>
                    <Col className="border-end">
                        <div>
                            <h5 className="primary">64503</h5>
                            <p className="text-muted">VIEWS</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <h5 className="primary">45</h5>
                            <p className="text-muted">DOWNLOADS</p>
                        </div>
                    </Col>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Author</p>
                    <h4 className="primary">
                        {resource.author ?? 'Bobby R. Bruce'}
                    </h4>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Description</p>
                    <p className="primary">
                        {resource.description ?? 'This is a description of the resource.'}
                    </p>
                    <Link
                        href={resource.github_url ?? 'https://www.gem5.org/documentation/general_docs/resources'}
                    >
                        Repository (GitHub)
                    </Link>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">License</p>
                    <p className="primary">
                        {resource.license ?? 'BSD-3-Clause'}
                        {' ('}
                        <Link
                            href={resource.license_url ?? 'https://opensource.org/licenses/BSD-3-Clause'}
                        >
                            LICENSE
                        </Link>
                        {')'}
                    </p>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Dependencies</p>
                    <p className="primary">
                        {
                            resource.resources ? Object.keys(resource.resources).map((key) => {
                                return (
                                    <>
                                        <Link key={key}
                                            href={'/resources/' + resource.resources[key]}
                                        >
                                            {resource.resources[key]}
                                        </Link>
                                        {', '}
                                    </>
                                )
                            }) : 'None'
                        }
                    </p>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Depend on this resource</p>
                    <p className="primary">
                        {
                            resource.workloads ? resource.workloads.map((workload, index) => {
                                return (
                                    <>
                                        <Link key={index}
                                            href={'/resources/' + workload.id}
                                        >
                                            {workload.id}
                                        </Link>
                                        {', '}
                                    </>
                                )
                            }) : 'None'
                        }
                    </p>
                </Row>
            </Container >
        </>
    )
}