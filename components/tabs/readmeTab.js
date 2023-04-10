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
                        <img
                            {...props}
                            src={`${github_url
                                .replace("github.com", "raw.githubusercontent.com")
                                .replace("tree/", "")}/${props.src}`}
                        />
                    ),
                }}
            >
                {readme}
            </ReactMarkdown>
        </Tab.Container>
    );
}