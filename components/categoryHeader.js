import { Button, Breadcrumb, Row, Col } from "react-bootstrap";
import Link from "next/link";
import styles from '/styles/categoryheader.module.css'

/**
 * @component
 * @description This component renders a header for a category page,
 * including a breadcrumb navigation and a "View All" button. It takes a
 * "category" prop as input and uses it to display the category name in the breadcrumb and button text.
 * The "View All" button links to a resources page filtered by the category.
 * The "capitalizeWord" function capitalizes the first letter of a string,
 * and the "pluralize" function adds plural suffix "s" or "ies" to a string based on its last letter.
 * The component is wrapped in a Row component with flex-wrap class for responsive layout.
 * @param {Object} props - The props object.
 * @param {string} props.category - The category name to display in the breadcrumb and button text.
 * @returns {JSX.Element} - The JSX element representing the category header.
 */
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