import Tab from "react-bootstrap/Tab";
import { useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import CopyIcon from "../copyIcon";
import { rehype } from "rehype";
import parse from "html-react-parser";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";

/**
@component ExampleTab
@description This component renders a tab container with pill-style navigation tabs, where each tab represents an example content. Each tab displays a copy icon alongside the rendered example content, and allows the user to copy the text content to the clipboard when the icon is clicked. It also displays a tooltip message when the example content has been successfully copied to the clipboard. The component receives an array of example content as a prop, and renders the example content as tab panes within the tab container.
@param {Object} props - The props object.
@param {Array} props.exampleContent - An array of example content objects, where each object should have the following properties:
@param {string} example.url - The URL of the example content.
@param {string} example.content - The text content of the example.
@param {boolean} example.tested - A boolean value indicating whether the example has been tested or not.
@returns {JSX.Element} - The JSX element representing the ExampleTab component.
*/
export default function ExampleTab({ exampleContent }) {
    const [examples, setExamples] = useState([]);
    useEffect(() => {
        async function textToHtml() {
            let content = [];
            for (let example of exampleContent) {
                let text = `<pre><code class="language-python">${example.content}</code></pre>`;
                text = await rehype()
                    .data("settings", { fragment: true })
                    .use(rehypeHighlight)
                    .process(text);
                content.push({
                    url: example.url,
                    content: parse(text.toString()),
                    tested: example.tested,
                });
            }
            setExamples(content);
        }
        textToHtml();
    }, [exampleContent]);
    return (
        <Tab.Container defaultActiveKey="0">
            <Nav variant="pills">
                {examples.map((content, index) => {
                    return (
                        <OverlayTrigger
                            key={index}
                            placement="top"
                            overlay={
                                content.tested ? (
                                    <Tooltip id="tooltip-top">Tested Example</Tooltip>
                                ) : (
                                    <></>
                                )
                            }
                        >
                            <Nav.Item>
                                <Nav.Link eventKey={index}>
                                    <>
                                        {content.url.split("/").slice(-1)[0]}{" "}
                                        {content.tested ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-patch-check"
                                                viewBox="0 0 16 16"
                                                aria-label="Tested Check"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                                                />
                                                <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                                            </svg>
                                        ) : null}
                                    </>
                                </Nav.Link>
                            </Nav.Item>
                        </OverlayTrigger>
                    );
                })}
            </Nav>
            <Tab.Content>
                {examples.map((content, index) => {
                    return (
                        <Tab.Pane eventKey={index} key={index}>
                            <CopyIcon>{content.content}</CopyIcon>
                        </Tab.Pane>
                    );
                })}
            </Tab.Content>
        </Tab.Container>
    );
}