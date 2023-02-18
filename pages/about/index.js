import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter';

function App() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Fetch the Markdown file
    fetch('https://raw.githubusercontent.com/Gem5Vision/gem5-resources-website/static-website/pages/about/index.md')
      .then(response => response.text())
      .then(text => setMarkdown(text));
  }, []);

  return (
    <div className="App" style={{
        padding: "50px"
    }}>
      <ReactMarkdown
      className='markdown-body mt-3'
      rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeRaw, rehypeSlug]}
      remarkPlugins={[remarkGfm, remarkToc, remarkFrontmatter]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default App;
