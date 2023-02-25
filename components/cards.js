import React from "react";
import { Card, Button } from "react-bootstrap";
import styles from "@/styles/cards.module.css";
import Link from "next/link";

export default function MyCards() {
  return (
    <div className={"mt-5 " + styles.containerStyle}>
      <hr />
      <h2 className={"font-weight-light primary " + styles.headerStyle}>
        Getting Started
      </h2>
      <p className="text-muted">
        First time using gem5? These resources might help.
      </p>
      <div className={styles.cardContainerStyle}>
        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>riscv-ubuntu-20.04-boot</Card.Title>
            <Card.Text>
              A full boot of Ubuntu 20.04 with Linux 5.10 for RISCV.
            </Card.Text>
            <Link href="/resources/riscv-ubuntu-20.04-boot" passHref legacyBehavior>
              <Button variant="outline-primary" href="/resources/riscv-ubuntu-20.04-boot">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>arm-hello64-static</Card.Title>
            <Card.Text>
              A 'Hello World!' binary, statically compiled to ARM 64 bit.
            </Card.Text>
            <Link href="/resources/arm-hello64-static" passHref legacyBehavior>
              <Button variant="outline-primary">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>x86-ubuntu-18.04-img</Card.Title>
            <Card.Text>
              A disk image containing Ubuntu 18.04 for x86.
            </Card.Text>
            <Link href="/resources/x86-ubuntu-18.04-img" passHref legacyBehavior>
              <Button variant="outline-primary" href="/resources/x86-ubuntu-18.04-img">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div >
  );
}