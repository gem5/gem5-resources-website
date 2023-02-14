import Image from 'next/image'
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import copy_icon from '/public/copy-icon.svg'
import { useState } from "react";
import React from 'react';

export default function CopyIcon({text}){
    const [target, setTarget] = useState(null);
    const [show, setShow] = useState(false);
    const copy = async (text) => {
        await navigator.clipboard.writeText(text);
        setShow(true);
        setTimeout(() => setShow(false), 750);
    }
    return (
        <>
        <span ref={setTarget} style={{ position: "relative" }}>
            <Image src={copy_icon} height={25} onClick={async () => copy(text)} />
        </span>

        <Overlay target={target} show={show} placement="right">
            {(props) => (
            <Tooltip id="overlay-tooltip" {...props}>
                {text} has been copied to the clipboard
            </Tooltip>
            )}
        </Overlay>
         </>
    )
}
