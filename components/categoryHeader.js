import { Button, Breadcrumb, Row, Col } from "react-bootstrap";
import Link from "next/link";
import styles from '/styles/categoryheader.module.css'

export default function CategoryHeader({ category }) {
    function capitalizeWord(string) {
        return (string.charAt(0).toUpperCase() + string.slice(1));
    }

    function pluralize(string) {
        const lastLetter = string.slice(-1);
        switch (lastLetter) {
            case 'y':
                return string.slice(0, string.length - 1) + "ies";
            default:
                return string + "s";
        }
    }

    return (
        <Row className={`${styles.categoriesHeaderRow} d-flex flex-wrap`}>
            <Col className={`${styles.categoriesHeaderCol} mt-3`}>
                <Breadcrumb className={styles.categoriesBreadcrumb}>
                    <Breadcrumb.Item href={process.env.BASE_PATH + "/"}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item href={process.env.BASE_PATH + "/category"}>Category</Breadcrumb.Item>
                    <Breadcrumb.Item active>{capitalizeWord(category)}</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
            <Col className={`${styles.categoriesHeaderCol} mt-3`}>
                <Link href={"/resources?q=category:" + category} passHref legacyBehavior>
                    <Button variant="outline-primary" className="main-text-regular">View All {pluralize(capitalizeWord(category))}</Button>
                </Link>
            </Col>
        </Row>
    );
}