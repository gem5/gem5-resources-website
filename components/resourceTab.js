import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter';
import CopyIcon from './copyIcon';
import { useRouter } from 'next/router';
import VersionPage from './versionPage';
import { rehype } from 'rehype';
import parse from 'html-react-parser'
/**
 * @component
 * @description The tab component for the resource page. This component is responsible for rendering the tabs and their content.
 *            It also handles the routing for the tabs.
 * @param {Object} resource The resource object.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function ResourceTab({ resource }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('readme');

  const [exampleContent, setExampleContent] = useState([]);
  useEffect(() => {
    async function fetchExampleContent() {
      if (!resource.example_urls) return;
      // convert github url to raw url
      let contents = []
      for (let url of resource.example_urls) {
        let raw_url = url.replace('github.com', 'raw.githubusercontent.com').replace('tree/', '');
        let res = await fetch(raw_url);
        let text = await res.text();

        contents.push({
          url: url,
          content: text
        });
      }
      setExampleContent(contents);
    }
    fetchExampleContent();
  }, [resource.example_urls]);

  useEffect(() => {
    const tabs = ['readme', 'changelog', 'usage', 'parameters', 'example', 'versions'];
    const page = router.asPath.split('/').slice(2);
    if (page[1]) {
      if (tabs.includes(page[1])) {
        setSelectedTab(page[1]);
      } else {
        router.push(`/resources/${resource.id}`, undefined, { shallow: true });
      }
    } else {
      setSelectedTab('readme');
    }
  }, [router, resource.id]);

  const handleSelect = (e) => {
    if (e === 'readme') {
      setSelectedTab(e);
      return router.replace(`/resources/${resource.id}`, undefined, { shallow: true });
    }
    setSelectedTab(e);
    // replace the tab in the url
    router.replace(`/resources/${resource.id}/${e}`, undefined, { shallow: true });
  }

  return (
    <div className='tabs'>
      <Tabs
        defaultActiveKey="readme"
        activeKey={selectedTab ?? 'readme'}
        onSelect={(e) => handleSelect(e)}
        className='mb-2'
      >
        <Tab eventKey="readme" title="Readme">
          <ReadmeTab github_url={resource.github_url} />
        </Tab>
        <Tab eventKey="changelog" title="Changelog">

        </Tab>
        <Tab eventKey="usage" title="Usage">
          <Usage exampleContent={exampleContent} id={resource.id} />
        </Tab>
        <Tab eventKey="parameters" title="Parameters">
          <Parameters params={resource.additional_params} />
        </Tab>
        <Tab eventKey="example" title="Example">
          <ExampleTab exampleContent={exampleContent} />
        </Tab>
        <Tab eventKey="versions" title="Versions">
          <h3 className='font-weight-light versions-table-title'>Versions of {resource.id}</h3>
          <VersionPage versions={resource.versions} url={resource.download_url} />
        </Tab>
      </Tabs>
    </div>
  )
}

function Usage({ exampleContent, id }) {
  const [usage, setUsage] = useState(<></>);

  useEffect(() => {
    async function textToHtml(string) {
      let text = `<pre><code class="language-python">${string}</code></pre>`;
      text = await rehype().data('settings', { fragment: true }).use(rehypeHighlight).process(text);
      setUsage(parse(text.toString()));
    }
    if (exampleContent.length === 0) return;
    let string = exampleContent[0].content;
    // remove python comments
    string = string.replace(/([^\(\.]"""[^\(]*)"""/g, '');
    string = string.replace(/[ \t]*#.*\n/gm, '');
    // match first function call sdasdasdasd.asdasdasd(
    const regex = /[\w.]+\(/im;
    let m;
    // find the first function call that has at least 2 keywords matching
    while ((m = regex.exec(string)) !== null) {
      let str = m[0];
      let n = 1;
      for (let i = m.index + str.length; i < string.length; i++) {
        str += string[i];
        if (string[i] === '(') {
          n++;
        }
        if (string[i] === ')') {
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
      <CopyIcon>
        {usage}
      </CopyIcon>
    </Tab.Container>
  )
}

function Parameters({ params }) {
  return (
    <Tab.Container defaultActiveKey="first">
      <div className='border rounded p-3 m-3'>
        {
          params && params.arguments ? params.arguments.map((arg, index) => {
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
          }) : "None"
        }
      </div>
    </Tab.Container>
  )
}

function ExampleTab({ exampleContent }) {
  const [examples, setExamples] = useState([]);
  useEffect(() => {
    async function textToHtml() {
      let content = [];
      for (let example of exampleContent) {
        let text = `<pre><code class="language-python">${example.content}</code></pre>`;
        text = await rehype().data('settings', { fragment: true }).use(rehypeHighlight).process(text);
        content.push({
          url: example.url,
          content: parse(text.toString())
        });
      }
      setExamples(content);
    }
    textToHtml();
  }, [exampleContent]);
  return (
    <Tab.Container defaultActiveKey="first">
      <Tabs variant="pills" defaultActiveKey="0" id="uncontrolled-tab-example">
        {
          examples.map((content, index) => {
            return <Tab eventKey={index} title={content.url.split('/').slice(-1)[0]} key={index}>
              <CopyIcon>
                {content.content}
              </CopyIcon>
            </Tab>
          })
        }
      </Tabs>
    </Tab.Container>
  );
}

function SEandFSToggle() {
  return (
    <Tab.Container defaultActiveKey="first">
      <Tabs variant="pills" defaultActiveKey="se" id="uncontrolled-tab-example">
        <Tab eventKey="se" title="SE Mode">
          <code>
            ## INSERT CODE HERE
          </code>
        </Tab>
        <Tab eventKey="fs" title="FS Mode">
          <code>
            ## INSERT CODE HERE
          </code>
        </Tab>
      </Tabs>
    </Tab.Container>
  );
}

function ReadmeTab({ github_url }) {
  const [readme, setReadme] = useState('');
  useEffect(() => {
    if (!github_url) return;
    const url = github_url.replace('github.com', 'raw.githubusercontent.com').replace('tree/', '') + '/README.md';
    fetch(url).then((res) => res.text()).then((text) => setReadme(text));
  }, [github_url]);
  return (
    <Tab.Container defaultActiveKey="first">
      {/* wrap pre tags in CopyIcon */}
      <ReactMarkdown
        className='markdown-body mt-3'
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeRaw, rehypeSlug]}
        remarkPlugins={[remarkGfm, remarkToc, remarkFrontmatter]}
        components={{
          pre: ({ node, ...props }) =>
            <CopyIcon>
              <pre {...props} >
                {props.children}
              </pre>
            </CopyIcon>,
        }}
      >
        {readme}
      </ReactMarkdown>
    </Tab.Container>
  )
}