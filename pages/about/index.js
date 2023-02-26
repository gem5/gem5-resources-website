import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter';

/**
 * @component
 * @description The About page. This page is rendered from a Markdown file.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
function About() {
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

export default About;
