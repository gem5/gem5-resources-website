import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import styles from '/styles/information.module.css'
export default function MetaData({ resource }) {
    return (
        <>
            <Container className={styles.info}>
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
                    <p className="text-muted">Publisher</p>
                    <h4 className="primary">
                        {resource.author ?? 'Bobby R. Bruce'}
                    </h4>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Metadata</p>
                    <p className="primary">
                        {resource.description ?? 'This is a description of the resource.'}
                    </p>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">License</p>
                    <p className="primary">
                        {resource.license ?? 'BSD-3-Clause'}
                        {' ('}
                        <Link className="primary"
                            href={resource.license_url ?? 'https://opensource.org/licenses/BSD-3-Clause'}
                        >
                            LICENCE
                        </Link>
                        {')'}
                    </p>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Dependancies</p>
                    <p className="primary">
                        {resource.dependencies ?? 'None'}
                    </p>
                </Row>
            </Container >
        </>
    )
}