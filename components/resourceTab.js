import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
import CopyIcon from "./copyIcon";
import { useRouter } from "next/router";
import VersionPage from "./versionPage";
import { rehype } from "rehype";
import parse from "html-react-parser";
import { Nav, OverlayTrigger, Placeholder, Tooltip } from "react-bootstrap";
import CreatePR from "./createPR";

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
    const page = router.asPath.split("/").slice(2);
    if (page[1]) {
      if (tabs.includes(page[1])) {
        setSelectedTab(page[1]);
      } else {
        router.push(`/resources/${resource.id}`, undefined, { shallow: true });
      }
    } else {
      setSelectedTab("readme");
    }
  }, [router, resource.id]);

  const handleSelect = (e) => {
    if (e === "readme") {
      setSelectedTab(e);
      return router.replace(`/resources/${resource.id}`, undefined, {
        shallow: true,
      });
    }
    setSelectedTab(e);
    // replace the tab in the url
    router.replace(`/resources/${resource.id}/${e}`, undefined, {
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
          <Usage
            use={resource.usage}
            exampleContent={exampleContent}
            id={resource.id}
          />
        </Tab>
        {resource.arguments ? (
          <Tab eventKey="parameters" title="Parameters">
            <Parameters params={resource.arguments} />
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
          <VersionPage
            versions={resource.versions}
            url={resource.download_url}
          />
        </Tab>
        <Tab eventKey="raw" title="Raw">
          <RawTab resource={resource} />
        </Tab>
      </Tabs>
    </div>
  );
}

function RawTab({ resource }) {
  const [raw, setRaw] = useState(<></>);
  useEffect(() => {
    async function textToHtml(string) {
      let text = `<pre><code class="language-python">${string}</code></pre>`;
      text = await rehype()
        .data("settings", { fragment: true })
        .use(rehypeHighlight)
        .process(text);
      setRaw(parse(text.toString()));
    }
    textToHtml(JSON.stringify(resource, null, 4));
  }, [resource]);
  return (
    <Tab.Container defaultActiveKey="first">
      <CopyIcon>{raw}</CopyIcon>
    </Tab.Container>
  );
}

function Usage({ use, exampleContent, id }) {
  const [usage, setUsage] = useState(<></>);

  useEffect(() => {
    async function textToHtml(string) {
      let text = `<pre><code class="language-python">${string}</code></pre>`;
      text = await rehype()
        .data("settings", { fragment: true })
        .use(rehypeHighlight)
        .process(text);
      setUsage(parse(text.toString()));
    }
    if (use != null && use.length > 0) {
      textToHtml(use);
      return;
    }
    if (exampleContent.length === 0) return;
    let string = exampleContent[0].content;
    // remove python comments
    string = string.replace(/([^\(\.]"""[^\(]*)"""/g, "");
    string = string.replace(/[ \t]*#.*\n/gm, "");
    // match first function call sdasdasdasd.asdasdasd(
    const regex = /[\w.]+\(/im;
    let m;
    // find the first function call that has at least 2 keywords matching
    while ((m = regex.exec(string)) !== null) {
      let str = m[0];
      let n = 1;
      for (let i = m.index + str.length; i < string.length; i++) {
        str += string[i];
        if (string[i] === "(") {
          n++;
        }
        if (string[i] === ")") {
          n--;
        }
        if (n === 0) {
          break;
        }
      }
      if (str.includes(id)) {
        textToHtml(str);
        return;
      }
      /* let keywords = id.split('-');
      console.log(keywords);
      let nMatches = keywords.filter((keyword) => str.includes(keyword)).length;
      if (nMatches >= 2) {
        textToHtml(str);
        return;
      } */
      string = string.substring(m.index + str.length);
    }
    setUsage(string);
  }, [exampleContent, id]);

  return (
    <Tab.Container defaultActiveKey="first">
      <CopyIcon>{usage}</CopyIcon>
    </Tab.Container>
  );
}

function Parameters({ params }) {
  return (
    <Tab.Container defaultActiveKey="first">
      <div className="border rounded p-3 m-3">
        {params && params.arguments
          ? params.arguments.map((arg, index) => {
              return (
                <CopyIcon key={index}>
                  <div>
                    <i>@param </i>
                    <code>{arg}</code>
                    {" - "}
                    {typeof arg}
                  </div>
                </CopyIcon>
              );
            })
          : "None"}
      </div>
    </Tab.Container>
  );
}

function ExampleTab({ exampleContent }) {
  const [examples, setExamples] = useState([]);
  useEffect(() => {
    async function textToHtml() {
      let content = [];
      for (let example of exampleContent) {
        let text = `<pre><code class="language-python">${example.content}</code></pre>`;
        text = await rehype()
          .data("settings", { fragment: true })
          .use(rehypeHighlight)
          .process(text);
        content.push({
          url: example.url,
          content: parse(text.toString()),
          tested: example.tested,
        });
      }
      setExamples(content);
    }
    textToHtml();
  }, [exampleContent]);
  return (
    <Tab.Container defaultActiveKey="0">
      <Nav variant="pills">
        {examples.map((content, index) => {
          return (
            <OverlayTrigger
              key={index}
              placement="top"
              overlay={
                content.tested ? (
                  <Tooltip id="tooltip-top">Tested Example</Tooltip>
                ) : (
                  <></>
                )
              }
            >
              <Nav.Item>
                <Nav.Link eventKey={index}>
                  <>
                    {content.url.split("/").slice(-1)[0]}{" "}
                    {content.tested ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-patch-check"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                        />
                        <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                      </svg>
                    ) : null}
                  </>
                </Nav.Link>
              </Nav.Item>
            </OverlayTrigger>
          );
        })}
      </Nav>
      <Tab.Content>
        {examples.map((content, index) => {
          return (
            <Tab.Pane eventKey={index} key={index}>
              <CopyIcon>{content.content}</CopyIcon>
            </Tab.Pane>
          );
        })}
      </Tab.Content>
    </Tab.Container>
  );
}

function ReadmeTab({ github_url }) {
  const [readme, setReadme] = useState("");
  useEffect(() => {
    async function getReadme() {
      const url =
        github_url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("tree/", "") + "/README.md";
      const res = await fetch(url);
      if (res.status !== 200)
        return setReadme("No README.md found in this repository");
      const text = await res.text();
      setReadme(text);
    }
    if (!github_url) return;
    getReadme();
  }, [github_url]);

  return (
    <Tab.Container defaultActiveKey="first">
      <ReactMarkdown
        className="markdown-body mt-3"
        rehypePlugins={[
          [rehypeHighlight, { ignoreMissing: true }],
          rehypeRaw,
          rehypeSlug,
        ]}
        remarkPlugins={[remarkGfm, remarkToc, remarkFrontmatter]}
        components={{
          pre: ({ node, ...props }) => (
            <CopyIcon>
              <pre {...props}>{props.children}</pre>
            </CopyIcon>
          ),
          // add url to image
          img: ({ node, ...props }) => (
            <img
              {...props}
              src={`${github_url
                .replace("github.com", "raw.githubusercontent.com")
                .replace("tree/", "")}/${props.src}`}
            />
          ),
        }}
      >
        {readme}
      </ReactMarkdown>
    </Tab.Container>
  );
}

function ChangelogTab({ github_url }) {
  const [readme, setReadme] = useState("");
  useEffect(() => {
    async function getReadme() {
      const url =
        github_url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("tree/", "") + "/CHANGELOG.md";
      const res = await fetch(url);
      if (res.status !== 200)
        return setReadme("No CHANGELOG.md found in this repository");
      const text = await res.text();
      setReadme(text);
    }
    if (!github_url) return;
    getReadme();
  }, [github_url]);

  return (
    <Tab.Container defaultActiveKey="first">
      <ReactMarkdown
        className="markdown-body mt-3"
        rehypePlugins={[
          [rehypeHighlight, { ignoreMissing: true }],
          rehypeRaw,
          rehypeSlug,
        ]}
        remarkPlugins={[remarkGfm, remarkToc, remarkFrontmatter]}
        components={{
          pre: ({ node, ...props }) => (
            <CopyIcon>
              <pre {...props}>{props.children}</pre>
            </CopyIcon>
          ),
          // add url to image
          img: ({ node, ...props }) => (
            <img
              {...props}
              src={`${github_url
                .replace("github.com", "raw.githubusercontent.com")
                .replace("tree/", "")}/${props.src}`}
            />
          ),
        }}
      >
        {readme}
      </ReactMarkdown>
    </Tab.Container>
  );
}
