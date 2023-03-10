import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter';
import about from './index.md'
import { Container } from 'react-bootstrap';

/**
 * @component
 * @description The About page. This page is rendered from a Markdown file.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
function About() {
  return (
    <Container className='mt-5'>
        <ReactMarkdown
        className='markdown-body mt-3 about-page'
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeRaw, rehypeSlug]}
        remarkPlugins={[remarkGfm, remarkToc, remarkFrontmatter]}>
          {about}
        </ReactMarkdown>
    </Container>
  );
}

export default About;
