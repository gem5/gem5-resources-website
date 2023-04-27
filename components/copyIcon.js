import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useState } from "react";
import React from 'react';

/**
 * @component
 * @description This component renders a copy icon alongside the given child element, and copies the text content of the child element to the clipboard when the icon is clicked. 
 * It also displays a tooltip message when the text has been successfully copied to the clipboard.
 * @param {Object} props - The props object.
 * @param {JSX.Element} props.children - The child element to copy the text from.
 * @returns {JSX.Element} - The JSX element representing the copy icon and child element.
*/
export default function CopyIcon(props) {
    const [target, setTarget] = useState(null);
    const [show, setShow] = useState(false);

    function generateString(element) {
        // recursively generate string from element
        // if element is text, return it
        if (typeof element === 'string') {
            // retain newlines
            return String(element)
        }
        // if element is an array, then it is a list of elements
        if (Array.isArray(element)) {
            let string = ''
            for (let i = 0; i < element.length; i++) {
                string += generateString(element[i])
            }
            return string
        }
        // if element is an object, then it is a react element
        if (typeof element === 'object') {
            let string = ''
            // if element has children, then it is a react element
            if (element.props.children) {
                string += generateString(element.props.children)
            }
            return string
        }
    }

    const copy = async (string) => {
        setShow(true);
        await navigator.clipboard.writeText(string);
        setTimeout(() => setShow(false), 750);
    }

    return (
        <div style={{ position: "relative", width: "auto" }}>
            {props.children}
            <span ref={setTarget} style={{
                position: "absolute", right: 0, top: 0, cursor: "pointer", marginRight: "5px",
                marginTop: "5px"
            }}>
                <div className='copy-button' onClick={async () => copy(generateString(props.children.props.children))} aria-label="Copy to clipboard" role='button'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" /><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                </div>
            </span>

            <Overlay target={target} show={show} placement="right">
                {(properties) => (
                    <Tooltip id="overlay-tooltip" {...properties}>
                        Text has been copied to the clipboard
                    </Tooltip>
                )}
            </Overlay>
        </div >
    )
}
