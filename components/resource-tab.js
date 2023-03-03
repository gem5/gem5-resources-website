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
import CopyIcon from './copy-icon';
import { useRouter } from 'next/router';
import VersionPage from './version-page';
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
      return router.push(`/resources/${resource.id}`, undefined, { shallow: true });
    }
    setSelectedTab(e);
    router.push(`/resources/${resource.id}/${e}`, undefined, { shallow: true });
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
          <SEandFSToggle />
        </Tab>
        <Tab eventKey="parameters" title="Parameters">

        </Tab>
        <Tab eventKey="example" title="Example">

          <ExampleTab exampleUrls={resource.example_urls} />
        </Tab>
        <Tab eventKey="versions" title="Versions">
          <h3 className='font-weight-light versions-table-title'>Versions of {resource.id}</h3>
          <VersionPage versions={resource.versions} url={resource.download_url} />
        </Tab>
      </Tabs>
    </div>
  )
}

function ExampleTab({ exampleUrls }) {
  const [exampleContent, setExampleContent] = useState([]);
  useEffect(() => {
    async function fetchExampleContent() {
      // convert github url to raw url
      let contents = []
      for (let url of exampleUrls) {
        let raw_url = url.replace('github.com', 'raw.githubusercontent.com').replace('tree/', '');
        let res = await fetch(raw_url);
        let text = await res.text();
        text = `<pre><code class="language-python">${text}</code></pre>`;
        text = await rehype().data('settings', { fragment: true }).use(rehypeHighlight).process(text);
        contents.push({
          url: url,
          content: parse(text.toString())
        });
      }
      setExampleContent(contents);
    }
    fetchExampleContent();
  }, [exampleUrls]);
  return (
    <Tab.Container defaultActiveKey="first">
      <Tabs variant="pills" defaultActiveKey="0" id="uncontrolled-tab-example">
        {
          exampleContent.map((content, index) => {
            return <Tab eventKey={index} title={content.url.split('/').slice(-1)[0]}>
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