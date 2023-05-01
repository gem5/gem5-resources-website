import Tab from "react-bootstrap/Tab";
import { useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import CopyIcon from "../copyIcon";
import { rehype } from "rehype";
import parse from "html-react-parser";

/**
 * @component RawTab
 * @description This component renders a tab container with a child element that displays the raw content of a resource object in a pre-formatted code block. It also includes a copy icon that allows the user to copy the content to the clipboard.
 * @param {Object} props - The props object.
 * @param {Object} props.resource - The resource object to display as raw content.
 * @returns {JSX.Element} - The JSX element representing the RawTab component.
 */
export default function RawTab({ resource }) {
    const [raw, setRaw] = useState(<></>);
    useEffect(() => {
        async function textToHtml(string) {
            let text = `<pre><code class="language-python">${string}</code></pre>`;
            text = await rehype()
                .data("settings", { fragment: true })
                .use(rehypeHighlight)
                .process(text);
            setRaw(parse(text.toString()));
        }
        resource = JSON.parse(JSON.stringify(resource));
        delete resource.database
        delete resource._id
        delete resource.workloads
        textToHtml(JSON.stringify(resource, null, 4));
    }, [resource]);
    return (
        <Tab.Container defaultActiveKey="first">
            <CopyIcon>{raw}</CopyIcon>
        </Tab.Container>
    );
}