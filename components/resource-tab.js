import { Row, Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav'
import { remark } from 'remark';
import html from 'remark-html';
import { useEffect, useState } from 'react';

export default function ResourceTab({ resource }) {
  const [selectedTab, setSelectedTab] = useState('readme');

  useEffect(() => {
    if (window.location.hash.substring(1) !== '') {
      setSelectedTab(window.location.hash.substring(1));
    }
  }, []);

  const handleSelect = (e) => {
    setSelectedTab(e);
    window.location.hash = e;
  }

  return (
    <Tabs
      defaultActiveKey="readme"
      id="uncontrolled-tab-example"
      className="mb-3"
      activeKey={selectedTab ? selectedTab : 'readme'}
      onSelect={(e) => handleSelect(e)}
    >
      <Tab eventKey="readme" title="Readme">
        <ReadmeTab url={resource.documentation_url} />
      </Tab>
      <Tab eventKey="changelog" title="Changelog">

      </Tab>
      <Tab eventKey="usage" title="Usage">
        <SEandFSToggle />
      </Tab>
      <Tab eventKey="parameters" title="Parameters">

      </Tab>
      <Tab eventKey="example" title="Example">
        <SEandFSToggle />
      </Tab>
      <Tab eventKey="versions" title="Versions">

      </Tab>
    </Tabs>
  )
}

function SEandFSToggle() {
  return (
    <Tab.Container defaultActiveKey="first">
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

function ReadmeTab({ url }) {
  const [readme, setReadme] = useState('');
  useEffect(() => {
    const fetchReadme = async () => {
      const result = await fetch(url ?? 'https://raw.githubusercontent.com/Gem5Vision/gem5-resources-website/main/README.md');
      const text = await result.text();
      const processedText = await remark().use(html).process(text);
      setReadme(processedText.toString());
    }
    fetchReadme();
  }, []);

  return (
    <Tab.Container defaultActiveKey="first">
      {readme && <div dangerouslySetInnerHTML={{ __html: readme }} />}
    </Tab.Container>
  )
}