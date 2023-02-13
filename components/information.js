import { Container, Row, Col } from "react-bootstrap";

export default function Information() {
    return (
        <>
            <Container className="information">
                <Row>
                    <Col>
                        <Col>
                            <h5 className="primary">Information</h5>
                        </Col>
                        <Col>
                            <div class="vr"></div>
                        </Col>
                    </Col>
                    <Col>
                        <Row>
                            <h5 className="primary">Information</h5>
                            <div class="vr"></div>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <h5 className="primary">Information</h5>
                            <div class="vr"></div>
                        </Row>
                    </Col>
                </Row>
                <hr />
            </Container >
        </>
    )
}