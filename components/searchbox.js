import { Container, Form, Button } from "react-bootstrap";
import styles from './searchbox.module.css'
export default function Seachbox() {
    return (
        <>
            <Form className="w-100">
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Search" />
                </Form.Group>
                <Container className={styles.buttonContainer}>
                    <Button variant="outline-primary">Search</Button>
                    <Button variant="outline-primary">Advanced Search</Button>
                </Container>
            </Form>
        </>
    )
}