import React, { useEffect, useState } from 'react';
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import cookie from "public/cookie.svg";
import styles from '@/styles/cookieConsent.module.css';

/**
* @component
* @description This component renders a cookie consent overlay with options to manage cookies. 
* It uses localStorage API to store user preferences for different types of cookies.
* @param {Object} props - The props object.
* @param {boolean} props.showConsentOverlay - A boolean indicating whether the cookie consent overlay should be displayed.
* @param {function} props.hasUpdated - A callback function to be called when the user updates their cookie preferences.
* @returns {JSX.Element|null} - The JSX element representing the cookie consent overlay.
*/
export default function CookieConsent({ showConsentOverlay, hasUpdated }) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [showModal, setShowModal] = useState(false);

    function updateVisbility() {
        setShowModal(false);
        setShowOverlay(false);
        hasUpdated(false);
    }

    function handleConsent() {
        localStorage.setItem('CookieConsent', JSON.stringify({ userPreference: 'all' }));
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
        updateVisbility();
    }

    useEffect(() => {
        setShowOverlay(showConsentOverlay);
    }, [showConsentOverlay]);

    if (!showOverlay) {
        return null;
    }

    if (!showModal) {
        return (
            <Container className={styles.cookiesOverlayContainer}>
                <Row className={`${styles.cookiesOverlayHeader}`}>
                    <h2 className={`${styles.overlayHeader} main-text-title-bold`}>Cookie Consent</h2>
                    <Image
                        className={`${styles.cookieImage}`}
                        src={cookie}
                        alt="Cookie"
                        height={35}
                    />
                </Row>
                <Row className={`${styles.cookiesOverlayBody} main-text-regular`}>
                    gem5 Resources utilizes cookies to enhance your experience when using this site. Non-essential cookies are used to track various
                    analytical and statistical parameters in order to provide additional functionality and data for the gem5Vision Team.
                </Row>
                <Row className={`${styles.cookiesOverlayButtons}`}>
                    <div className="d-flex justify-content-end gap-2">
                        <Button className={`${styles.btnSecondary} main-text-regular`} onClick={() => { setShowModal(true) }}>Manage Cookies</Button>
                        <Button className={`${styles.btnPrimary} main-text-regular`} onClick={() => { handleConsent() }}>Accept All</Button>
                    </div>
                </Row>
            </Container>
        );
    } else {
        return (
            <CookieConsentModal updateVisbility={updateVisbility} />
        );
    }
}

/**
 * @component
 * @description This component renders a cookie consent modal with options for required, preferences, and statistics cookies.
 * Users can toggle their consent for each type of cookie, and their preferences are stored locally in the browser using the localStorage API.
 * @param {Object} props - The props object.
 * @param {Function} props.updateVisbility - The function to update the visibility of the modal.
 * @returns {JSX.Element} - The JSX element representing the cookie consent modal.
 */
function CookieConsentModal({ updateVisbility }) {
    const [isToggled, setIsToggled] = useState([true, true, true]);

    function handleConsent() {
        let userPreference;

        if (isToggled[0] && !isToggled[1] && !isToggled[2]) {
            userPreference = JSON.stringify({ userPreference: 'required' });
        } else if (isToggled[1] && !isToggled[2]) {
            userPreference = JSON.stringify({ userPreference: 'preference' });
        } else if (isToggled[2] && !isToggled[1]) {
            userPreference = JSON.stringify({ userPreference: 'statistics' });
        } else {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            userPreference = JSON.stringify({ userPreference: 'all' });
        }

        localStorage.setItem('CookieConsent', userPreference);
        updateVisbility();
    }

    return (
        <Modal show={true}>
            <Modal.Header>
                <Modal.Title className={`${styles.modalTitle} main-text-title-bold`}>Cookie Policy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Row>
                            <Col>
                                <h2 className={`${styles.modalBodyTitle} main-text-semi`}>Required Cookies</h2>
                            </Col>
                            <Col className={`${styles.toggleCol}`}>
                                <ToggleSwitch setPermanentActive={true} index={0} isToggled={isToggled} setIsToggled={setIsToggled} />
                            </Col>
                        </Row>
                        <p className={`main-text-regular`}>
                            Your preference for First Party and Third Party cookies is stored locally on your browser through the localStorage API.
                        </p>
                    </Row>
                    <hr />
                    <Row>
                        <Row>
                            <Col>
                                <h2 className={`${styles.modalBodyTitle} main-text-semi`}>Preferences Cookies</h2>
                            </Col>
                            <Col className={`${styles.toggleCol}`}>
                                <ToggleSwitch index={1} isToggled={isToggled} setIsToggled={setIsToggled} />
                            </Col>
                        </Row>
                        <p className={`main-text-regular`}>
                            Preference cookies are utilized to store recently visited resources and resources saved for checkout through the localStorage API.
                            By consenting to these optional cookies, you allow us to store and utilize the outlined data.
                        </p>
                    </Row>
                    <hr />
                    <Row>
                        <Row>
                            <Col>
                                <h2 className={`${styles.modalBodyTitle} main-text-semi`}>Statistics Cookies</h2>
                            </Col>
                            <Col className={`${styles.toggleCol}`}>
                                <ToggleSwitch index={2} isToggled={isToggled} setIsToggled={setIsToggled} />
                            </Col>
                        </Row>
                        <p className={`main-text-regular`}>
                            Statistic cookies are collected through Google Analytics for tracking of parameters such as repeat and unique visitors, page visits, location, downloads, and other page events.
                            By consenting to these optional cookies, you allow Google to track these parameters on our behalf.
                        </p>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button className={`${styles.btnPrimary} main-text-regular`} onClick={() => { handleConsent() }}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

/**
 * @component
 * @description This component renders a toggle switch with an optional "setPermanentActive" prop that determines whether the switch is always active and disabled.
 * It takes an "index" prop to identify the position of the switch in a list, an "isToggled" prop which is an array of boolean values representing the toggle state of each switch,
 * and an "setIsToggled" prop which is a function to update the toggle state. When the switch is toggled, the "isToggled" prop is updated using the "setIsToggled" function.
 * The component is styled with a CSS class "toggleSwitch" and includes an input element with a checkbox, and a span element as the slider.
 * When "setPermanentActive" is true, the switch is checked and disabled with a not-allowed cursor style.
 * @param {Object} props - The props object.
 * @param {boolean} props.setPermanentActive - Determines whether the switch is always active and disabled. Default is false.
 * @param {number} props.index - The index of the switch in a list.
 * @param {boolean[]} props.isToggled - An array of boolean values representing the toggle state of each switch.
 * @param {function} props.setIsToggled - A function to update the toggle state.
 * @returns {JSX.Element} - The JSX element representing the toggle switch.
 */
function ToggleSwitch({ setPermanentActive, index, isToggled, setIsToggled }) {
    return (
        <label className={`${styles.toggleSwitch}`}>
            {setPermanentActive ?
                <input type="checkbox" checked={true} readOnly={true} disabled />
                :
                <input type="checkbox" checked={isToggled[index]} onChange={() => {
                    const newIsToggled = [...isToggled];
                    newIsToggled[index] = !isToggled[index];
                    setIsToggled(newIsToggled);
                }}
                />
            }
            <span className={`${styles.toggleSlider}`} style={setPermanentActive ? { cursor: 'not-allowed' } : null} />
        </label>
    );
}
