import React from "react";
import { Card, Button } from "react-bootstrap";
import styles from "@/styles/cards.module.css";
import Link from "next/link";

/**
 * @component
 * @description This function returns a set of cards that display information and a button to link to the categories.
 * @returns {JSX.Element} JSX Element containing cards displaying information and a button to link to categories pages.
 */
export default function CategoriesCards() {
  return (
    <div className={"mt-3 " + styles.containerStyle}>
      <hr />
      <h2 className={"font-weight-light primary " + styles.headerStyle}>
        Categories
      </h2>
      <p className="text-muted">
        These are the "Categories" of Resources we use on this website.
      </p>
      <div className={styles.cardContainerStyle}>
        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Workload</Card.Title>
            <Card.Text>
              Bundles of resources and any input parameters.
            </Card.Text>
            <Link href="/category/workload" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/workload">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>SimPoint</Card.Title>
            <Card.Text>
              A sampling method that increases the speed of gem5 simulations.
            </Card.Text>
            <Link href="/category/simpoint" passHref legacyBehavior>
              <Button variant="outline-primary">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Checkpoint</Card.Title>
            <Card.Text>
              A snapshot of a simulation.
            </Card.Text>
            <Link href="/category/checkpoint" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/checkpoint">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Binary</Card.Title>
            <Card.Text>
              An executable program.
            </Card.Text>
            <Link href="/category/binary" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/binary">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Disk Image</Card.Title>
            <Card.Text>
              A file that contains an exact copy of the data stored on a storage device.
            </Card.Text>
            <Link href="/category/diskimage" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/diskimage">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Benchmark</Card.Title>
            <Card.Text>
              A tool used to measure the performance of a computer system.
            </Card.Text>
            <Link href="/category/benchmark" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/benchmark">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Bootloader</Card.Title>
            <Card.Text>
              A small program that is responsible for loading the operating system into memory when a computer starts up.
            </Card.Text>
            <Link href="/category/bootloader" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/bootloader">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Kernel</Card.Title>
            <Card.Text>
              A computer program that acts as the core of an operating system by managing system resources.
            </Card.Text>
            <Link href="/category/kernel" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/kernel">Learn More</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div >
  );
}