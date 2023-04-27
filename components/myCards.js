import React from "react";
import { Card, Button } from "react-bootstrap";
import Link from "next/link";

/**
 * @component MyCards
 * @description This component renders a card with a title, text, and a button.
 * @param {Object} props - The props object.
 * @param {string} props.className - The CSS class name for the card.
 * @param {string} props.cardTitle - The title to be displayed in the card.
 * @param {string} props.cardText - The text content to be displayed in the card.
 * @param {string} props.pathRef - The path reference for the link to be associated with the button.
 * @param {string} props.buttonText - The text to be displayed on the button.
 * @returns {JSX.Element} - The JSX element representing the card component with title, text, and button.
 */
export default function MyCards({ className, cardTitle, cardText, pathRef, buttonText }) {
    return (
        <Card className={className} aria-label="card">
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
