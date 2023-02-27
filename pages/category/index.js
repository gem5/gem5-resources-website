import Link from "next/link"
import { Container, ListGroup } from "react-bootstrap"

export default function Category() {
    const categories = ["Workload",
        "Simpoint",
        "Resource",
        "Checkpoint",
        "Binary",
        "Diskimage",
        "Benchmark",
        "Bootloader",
        "Kernel"]
    return (
        <Container>
            <h1>
                Categories
            </h1>
            <ListGroup>
                {
                    categories.map((category) => {
                        return (
                            <ListGroup.Item key={category}>
                                <Link href={`/category/${category.toLowerCase()}`}>
                                    {category}
                                </Link>
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        </Container>

    )
}