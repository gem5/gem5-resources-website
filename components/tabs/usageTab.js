import Tab from "react-bootstrap/Tab";
import { useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import CopyIcon from "../copyIcon";
import { rehype } from "rehype";
import parse from "html-react-parser";

/**
@component
@description This component renders a usage tab with syntax highlighted code alongside the given child element,
and allows copying the code to the clipboard when the copy icon is clicked.
@param {Object} props - The props object.
@param {string} props.use - The code to be displayed in the usage tab.
If not provided, the code will be generated from the example content.
@param {Array} props.exampleContent - An array of example content objects,
where each object has a content property containing the code string.
@param {string} props.id - The ID to be matched in the generated code to determine
which code block to display in the usage tab.
@returns {JSX.Element} - The JSX element representing the usage tab with
syntax highlighted code and copy icon.
*/
export default function UsageTab({ use, exampleContent, id }) {
    const [usage, setUsage] = useState(<></>);

    useEffect(() => {
        async function textToHtml(string) {
            let text = `<pre><code class="language-python">${string}</code></pre>`;
            text = await rehype()
                .data("settings", { fragment: true })
                .use(rehypeHighlight)
                .process(text);
            setUsage(parse(text.toString()));
        }
        if (use != null && use.length > 0) {
            textToHtml(use);
            return;
        }
        if (exampleContent.length === 0) return;
        let string = exampleContent[0].content;
        // remove python comments
        string = string.replace(/([^\(\.]"""[^\(]*)"""/g, "");
        string = string.replace(/[ \t]*#.*\n/gm, "");
        // match first function call sdasdasdasd.asdasdasd(
        const regex = /[\w.]+\(/im;
        let m;
        // find the first function call that has at least 2 keywords matching
        while ((m = regex.exec(string)) !== null) {
            let str = m[0];
            let n = 1;
            for (let i = m.index + str.length; i < string.length; i++) {
                str += string[i];
                if (string[i] === "(") {
                    n++;
                }
                if (string[i] === ")") {
                    n--;
                }
                if (n === 0) {
                    break;
                }
            }
            if (str.includes(id)) {
                textToHtml(str);
                return;
            }
            /* let keywords = id.split('-');
            let nMatches = keywords.filter((keyword) => str.includes(keyword)).length;
            if (nMatches >= 2) {
              textToHtml(str);
              return;
            } */
            string = string.substring(m.index + str.length);
        }
        setUsage(string);
    }, [exampleContent, id, use]);

    return (
        <Tab.Container defaultActiveKey="first">
            <CopyIcon>{usage}</CopyIcon>
        </Tab.Container>
    );
}