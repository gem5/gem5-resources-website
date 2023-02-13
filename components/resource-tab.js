import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

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
        <Tab eventKey="example" title="Example" href="#">

        </Tab>
        <Tab eventKey="versions" title="Versions" href="#">

        </Tab>
        </Tabs>
    )
}