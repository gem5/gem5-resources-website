import Tab from "react-bootstrap/Tab";
import { useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import CopyIcon from "../copyIcon";
import { rehype } from "rehype";
import parse from "html-react-parser";

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
        textToHtml(JSON.stringify(resource, null, 4));
    }, [resource]);
    return (
        <Tab.Container defaultActiveKey="first">
            <CopyIcon>{raw}</CopyIcon>
        </Tab.Container>
    );
}