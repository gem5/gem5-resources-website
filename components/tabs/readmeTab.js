import Tab from "react-bootstrap/Tab";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
import CopyIcon from "../copyIcon";
import Image from "next/image";

/**
 * @component
 * @description This component renders a tab container with a copy icon alongside the
 * rendered markdown content from the README.md file in the provided GitHub repository URL.
 * The markdown content is parsed and displayed using the ReactMarkdown library.
 * The copy icon allows users to copy the code block content to clipboard.
 * The component also handles cases where the README.md file is not found
 * or the provided GitHub URL is invalid.
 * @param {Object} props - The props object.
 * @param {string} props.github_url - The GitHub repository URL.
 * @returns {JSX.Element} - The JSX element representing the tab container and rendered markdown content.
*/
export default function ReadmeTab({ github_url }) {
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
        // check if the url is a valid github url
        if (!github_url.match(/github\.com\/[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+/))
            return setReadme("Invalid GitHub URL");
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
                        <Image
                            {...props}
                            src={`${github_url
                                .replace("github.com", "raw.githubusercontent.com")
                                .replace("tree/", "")}/${props.src}`}
                            alt="Readme"
                        />
                    ),
                }}
            >
                {readme}
            </ReactMarkdown>
        </Tab.Container>
    );
}