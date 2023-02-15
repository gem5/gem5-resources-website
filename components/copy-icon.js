import Image from 'next/image'
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import copy_icon from '/public/copy-icon.svg'
import { useState } from "react";
import React from 'react';
import { HTMLDivElement } from 'react'

export default function CopyIcon(props) {
    const [text, setText] = useState('');
    const [target, setTarget] = useState(null);
    const [show, setShow] = useState(false);

    function generateString(element) {
        // recursively generate string from element
        // if element is text, return it
        if (typeof element === 'string') {
            return element
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



    useState(() => {
        setText(generateString(props.children.props.children))
    }, [])

    const copy = async (string) => {
        setShow(true);
        await navigator.clipboard.writeText(string);
        setTimeout(() => setShow(false), 750);
    }
    return (
        <div style={{ position: "relative", width: "auto" }}>
            {props.children}
            < span ref={setTarget} style={{
                position: "absolute", right: 0, top: 0, cursor: "pointer", marginRight: "5px",
                marginTop: "5px"
            }}>
                <Image src={copy_icon} height={25} onClick={async () => copy(text)} alt="Copy Icon" />
            </span >

            <Overlay target={target} show={show} placement="right">
                {(properties) => (
                    <Tooltip id="overlay-tooltip" {...properties}>
                        {text} has been copied to the clipboard
                    </Tooltip>
                )}
            </Overlay>
        </div >
    )
}
