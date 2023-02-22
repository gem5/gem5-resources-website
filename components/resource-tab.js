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
          <SEandFSToggle />
        </Tab>
        <Tab eventKey="versions" title="Versions">
          <VersionPage versions={resource.versions} />
        </Tab>
      </Tabs>
    </div>
  )
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