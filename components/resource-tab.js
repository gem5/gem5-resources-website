import { Row, Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav'

function SEandFSToggle() {
    return (
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Col>
          <Row sm={3}>
            <Nav variant="pills" className="flex-row">
              <Nav.Item>
                <Nav.Link eventKey="first">SE Mode</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">FS Mode</Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>
          <Row sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
              <code>
                    ## INSERT CODE HERE
              </code>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
              <code>
                    ## INSERT CODE HERE
              </code>
              </Tab.Pane>
            </Tab.Content>
          </Row>
        </Col>
      </Tab.Container>
    );
  }

export default function ResourceTab() {
    return (
        <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
        >
        <Tab eventKey="readme" title="Readme" href="#">

        </Tab>
        <Tab eventKey="changelog" title="Changelog" href="#">

        </Tab>
        <Tab eventKey="usage" title="Usage" href="#">
            <SEandFSToggle />
        </Tab>
        <Tab eventKey="parameters" title="Parameters" href="#">

        </Tab>
        <Tab eventKey="example" title="Example" href="#">
            <SEandFSToggle />
        </Tab>
        <Tab eventKey="versions" title="Versions" href="#">

        </Tab>
        </Tabs>
    )
}