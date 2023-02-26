import { Container } from "react-bootstrap";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter';
import CopyIcon from '@/components/copy-icon';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Checkpoint() {
    const [checkpoint, setCheckpoint] = useState("");
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/gem5/website/stable/_pages/documentation/general_docs/checkpoints.md')
            .then((response) => response.text())
            .then((text) => {
                setCheckpoint(text);
            });
    }, []);
    return (
        <Container>
            <Link
                href="/resources?q=category:checkpoint"
            >
                View all checkpoints
            </Link>
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
                {checkpoint}
            </ReactMarkdown>
        </Container>
    )
}