import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import styles from "@/styles/cards.module.css";
import Link from "next/link";
import { getFilters } from "@/pages/api/getfilters";

/**
 * @component
 * @description This function returns a set of cards that display information and a button to link to the categories.
 * @returns {JSX.Element} JSX Element containing cards displaying information and a button to link to categories pages.
 */
export default function CategoriesCards() {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    async function getCategory() {
      const filters = await getFilters()
      let category = []
      for (let i = 0; i < filters.category.length; i++) {
        if (filters.category[i] == "workload") {
          category.push({
            name: "Workload",
            description: "Bundles of resources and any input parameters.",
          })
        }
        else if (filters.category[i] == "simpoint") {
          category.push({
            name: "SimPoint",
            description: "A sampling method that increases the speed of gem5 simulations.",
          })
        }
        else if (filters.category[i] == "checkpoint") {
          category.push({
            name: "Checkpoint",
            description: "A snapshot of a simulation.",
          })
        }
        else if (filters.category[i] == "diskimage") {
          category.push({
            name: "Disk Image",
            description: "A file that contains an exact copy of the data stored on a storage device.",
          })
        }
        else if (filters.category[i] == "kernel") {
          category.push({
            name: "Kernel",
            description: "A computer program that acts as the core of an operating system by managing system resources.",
          })
        }
        else if (filters.category[i] == "bootloader") {
          category.push({
            name: "Bootloader",
            description: "A small program that is responsible for loading the operating system into memory when a computer starts up.",
          })
        }
        else if (filters.category[i] == "benchmark") {
          category.push({
            name: "Benchmark",
            description: "A program that is used to test the performance of a computer system.",
          })
        }
        else if (filters.category[i] == "binary") {
          category.push({
            name: "Binary",
            description: "An executable program.",
          })
        }
      }
      setCategories(category)
    }
    getCategory()
  }, [])

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
        {
          categories.map((category) => {
            return (
              <Card className={styles.cardStyle} key={category.name}>
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text>{category.description}</Card.Text>
                  <Link href={"/category/" + category.name.replace(/\s/g, '').toLowerCase()} passHref legacyBehavior>
                    <Button variant="outline-primary" href={"/category/" + category.name.toLowerCase()}>Learn More</Button>
                  </Link>
                </Card.Body>
              </Card>
            )
          })
        }
        {/* <Card className={styles.cardStyle}>
          <Card.Body>
            <Card.Title>Workload</Card.Title>
            <Card.Text>
              Bundles of resources and any input parameters.
            </Card.Text>
            <Link href="/category/workload" passHref legacyBehavior>
              <Button variant="outline-primary" href="/category/workload">Learn More</Button>
            </Link>
          </Card.Body>
        </Card> */}
      </div>
    </div >
  );
}