import React from "react";
import { Card, Button } from "react-bootstrap";

export default function MyCards() {
  const cardContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  };

  const cardStyle = {
    width: "calc(100% / 3 - 1rem)",
  };

  const headerStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#0095AF",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    padding: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>Getting Started</div>
      <div style={cardContainerStyle}>
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>riscv-ubuntu-20.04-boot</Card.Title>
            <Card.Text>
                A full boot of Ubuntu 20.04 with Linux 5.10 for RISCV.
            </Card.Text>
            <Button variant="primary" href="/resources/riscv-ubuntu-20.04-boot">Learn More</Button>
          </Card.Body>
        </Card>

        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>arm-hello64-static</Card.Title>
            <Card.Text>
                A 'Hello World!' binary, statically compiled to ARM 64 bit.
            </Card.Text>
            <Button variant="primary" href="/resources/arm-hello64-static">Learn More</Button>
          </Card.Body>
        </Card>

        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>x86-ubuntu-18.04-img</Card.Title>
            <Card.Text>
                A disk image containing Ubuntu 18.04 for x86.
            </Card.Text>
            <Button variant="primary" href="/resources/x86-ubuntu-18.04-img">Learn More</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}