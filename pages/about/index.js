import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter';
import about from './index.md'

function App() {
  return (
    <div className="App" style={{
        padding: "50px"
    }}>
      <ReactMarkdown
      className='markdown-body mt-3'
      rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeRaw, rehypeSlug]}
      remarkPlugins={[remarkGfm, remarkToc, remarkFrontmatter]}>
        {about}
      </ReactMarkdown>
    </div>
  );
}

export default App;
