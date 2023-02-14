import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'

export default function ResourceTab({ resource }) {
  const [selectedTab, setSelectedTab] = useState('readme');
  const tabs = ['readme', 'changelog', 'usage', 'parameters', 'example', 'versions'];
  useEffect(() => {
    if (window.location.hash.substring(1) !== '') {
      const tab = window.location.hash.substring(1);
      if (tabs.includes(tab)) {
        setSelectedTab(window.location.hash.substring(1));
      }
    }
  }, [tabs]);

  const handleSelect = (e) => {
    setSelectedTab(e);
    window.location.hash = e;
  }

  return (
    <div className='tabs'>
      <Tabs
        defaultActiveKey="readme"
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

function ReadmeTab({ url }) {
  const [readme, setReadme] = useState('');
  useEffect(() => {
    const fetchReadme = async () => {
      const result = await fetch(url ?? 'https://raw.githubusercontent.com/remarkjs/react-markdown/main/readme.md');
      const text = await result.text();
      setReadme(text);
    }
    fetchReadme();
  }, [url]);

  return (
    <Tab.Container defaultActiveKey="first">
      <ReactMarkdown
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeSlug, rehypeRaw]}
        remarkPlugins={[remarkToc, remarkGfm]}
      >
        {readme}
      </ReactMarkdown>
    </Tab.Container>
  )
}