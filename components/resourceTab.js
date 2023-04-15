import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import VersionTab from "./tabs/versionTab";
import { Placeholder } from "react-bootstrap";
import ReadmeTab from "./tabs/readmeTab";
import ChangelogTab from "./tabs/changelogTab";
import UsageTab from "./tabs/usageTab";
import ParametersTab from "./tabs/parametersTab";
import ExampleTab from "./tabs/exampleTab";
import RawTab from "./tabs/rawTab";

/**
 * @component
 * @description The tab component for the resource page. This component is responsible for rendering the tabs and their content.
 *            It also handles the routing for the tabs.
 * @param {Object} resource The resource object.
 * @returns {JSX.Element} The JSX element to be rendered.
 */
export default function ResourceTab({ resource }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("readme");

  const [exampleContent, setExampleContent] = useState([]);
  useEffect(() => {
    async function fetchExampleContent() {
      if (!resource.code_examples) return;
      // convert github url to raw url
      let contents = [];
      for (let example of resource.code_examples) {
        const url = example.example;
        let raw_url = url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("tree/", "");
        let res = await fetch(raw_url);
        let text = await res.text();

        contents.push({
          url: url,
          content: text,
          tested: example.tested,
        });
      }
      setExampleContent(contents);
    }
    fetchExampleContent();
  }, [resource.code_examples]);

  useEffect(() => {
    if (!router.isReady) return;

    const tabs = [
      "readme",
      "changelog",
      "usage",
      "parameters",
      "example",
      "versions",
      "raw",
    ];
    let page = router.query.page;
    console.log(page);
    if (page) {
      page = page[0]
      if (tabs.includes(page)) {
        setSelectedTab(page);
      } else {
        let query = router.query;
        delete query.id;
        delete query.page;
        router.push(
          {
            pathname: `/resources/${resource.id}`,
            // QUERY IS EVERYTHING EXCEPT ID
            query: query,
          }, undefined, {
          shallow: true,
        });
      }
    } else {
      setSelectedTab("readme");
    }
  }, [router, resource.id]);

  const handleSelect = (e) => {
    setSelectedTab(e);
    let query = router.query;
    delete query.id;
    delete query.page;
    console.log(query);
    if (e === "readme") {
      return router.replace({
        pathname: `/resources/${resource.id}`,
        query: query,
      }, undefined, {
        shallow: true,
      });
    }
    // replace the tab in the url
    router.replace({
      pathname: `/resources/${resource.id}/${e}`,
      query: query,
    }, undefined, {
      shallow: true,
    });
  };

  return Object.keys(resource).length === 0 ? (
    <Placeholder as="div" animation="glow" className="tabs">
      <Placeholder xs={12} />
    </Placeholder>
  ) : (
    <div className="tabs">
      <Tabs
        defaultActiveKey="readme"
        activeKey={selectedTab ?? "readme"}
        onSelect={(e) => handleSelect(e)}
        className="mb-2 main-text-regular"
      >
        <Tab eventKey="readme" title="Readme">
          <ReadmeTab github_url={resource.source_url} />
        </Tab>
        <Tab eventKey="changelog" title="Changelog">
          <ChangelogTab github_url={resource.source_url} />
        </Tab>
        <Tab eventKey="usage" title="Usage">
          <UsageTab
            use={resource.example_usage}
            exampleContent={exampleContent}
            id={resource.id}
          />
        </Tab>
        {resource.arguments ? (
          <Tab eventKey="parameters" title="Parameters">
            <ParametersTab params={resource.arguments} />
          </Tab>
        ) : null}
        {exampleContent.length > 0 ? (
          <Tab eventKey="example" title="Example">
            <ExampleTab exampleContent={exampleContent} />
          </Tab>
        ) : null}
        <Tab eventKey="versions" title="Versions">
          <h3 className="font-weight-light versions-table-title">
            Versions of {resource.id}
          </h3>
          <VersionTab
            id={resource.id}
            database={resource.database}
          />
        </Tab>
        <Tab eventKey="raw" title="Raw">
          <RawTab resource={resource} />
        </Tab>
      </Tabs>
    </div>
  );
}
