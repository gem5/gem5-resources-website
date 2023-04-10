import React from "react";
import { Card, Button } from "react-bootstrap";
import Link from "next/link";

export default function MyCards({ className, cardTitle, cardText, pathRef, buttonText }) {
    return (
        <Card className={className}>
            <Card.Body>
                <Card.Title className="secondary-text-semi">{cardTitle}</Card.Title>
                <Card.Text className="main-text-regular">{cardText}</Card.Text>
                <Link href={pathRef} passHref legacyBehavior>
                    <Button variant="outline-primary" className="main-text-regular">{buttonText}</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}
