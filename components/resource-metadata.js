import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import styles from '/styles/metadata.module.css'

/**
 * @component
 * @description A component that renders the metadata of a resource that includes
 *             the number of likes, views, downloads, author, description, license,
 *            dependencies, and depend on this resource.
 * @param {Object} resource The resource object.
 * @param {string} className The class name of the component.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function MetaData({ resource, className }) {
    console.log(resource)
    return (
        <>
            <Container className={styles.info + ' ' + className}>
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
                                <>
                                    {author}
                                    {index < resource.author.length - 1 ? ', ' : ''}
                                </>
                            )
                        }) : 'Unknown'}
                    </h4>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Description</p>
                    <p className="primary">
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
                            resource.resources ? Object.keys(resource.resources).map((key, index) => {
                                return (
                                    <>
                                        <a key={key}
                                            href={'/gem5-resources-website/resources/' + resource.resources[key]}
                                        >
                                            {resource.resources[key]}
                                        </a>
                                        {index != Object.keys(resource.resources).length - 1 ? ', ' : ''}
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
                            resource.workloads.length > 0 ? resource.workloads.map((workload, index) => {
                                return (
                                    <>
                                        <a key={workload}
                                            href={'/gem5-resources-website/resources/' + workload}
                                        >
                                            {workload}
                                        </a>
                                        {index != resource.workloads.length - 1 ? ', ' : ''}
                                    </>
                                )
                            }) : 'None'
                        }
                    </p>
                </Row>
                <Row className="border-bottom">
                    <p className="text-muted">Tags</p>
                    <p className="primary">
                        {
                            resource.tags ? resource.tags.map((tag, index) => {
                                return (
                                    <>
                                        <Link key={tag}
                                            href={'/resources?q=tag:' + tag}
                                        >
                                            {tag}
                                        </Link>
                                        {index < resource.tags.length - 1 ? ', ' : ''}
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