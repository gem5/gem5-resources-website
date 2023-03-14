import { Modal, Button, Tab, Tabs } from "react-bootstrap";
import React, { useEffect, useState } from 'react';

export default function CookieConsent({ showConsentModal, hasUpdated }) {
    const [showModal, setShowModal] = useState(showConsentModal);

    const handleConsent = (consentLevel) => {
        setShowModal(false);
        localStorage.setItem('CookieConsent', JSON.stringify({userPreference: consentLevel}));
        if (consentLevel === "all") {
            gtag('consent', 'update', {
              'analytics_storage': 'granted'
            });
        }
        hasUpdated(false);
    }

    useEffect(() => {
        setShowModal(showConsentModal);
    }, [showConsentModal]);

    return (
        <Modal show={showModal} backdrop="static">
            <Modal.Header closeButton={false} className="justify-content-center primary main-text-title-bold">
                <Modal.Title className="main-text-title-bold" style={{ fontSize:"1.75rem" }}>Cookie Consent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="required" className="mb-3 main-text-regular">
                    <Tab eventKey="required" title="Required" className="main-text-regular">
                        Your preference for First Party and Third Party cookies is stored locally on your browser through the localStorage API. 
                    </Tab>
                    <Tab eventKey="firstParty" title="1st Party" className="main-text-regular">
                        Preference cookies are utilized to store recently visited resources and resources saved for checkout through the localStorage API. 
                        By consenting to these optional cookies, you allow us to store and utilize the outlined data. 
                    </Tab>
                    <Tab eventKey="thirdParty" title="3rd Party" className="main-text-regular">
                        Statistic cookies are collected through Google Analytics for tracking of parameters such as repeat and unique visitors, page visits, location, downloads, and other page events. 
                        By consenting to these optional cookies, you allow Google to track these parameters on our behalf.  
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="main-text-regular" onClick={() => { handleConsent("required") }}>Accept Required</Button>
                <Button variant="secondary" className="main-text-regular" onClick={() => { handleConsent("first") }}>Accept 1st Party</Button>
                <Button variant="" className="main-text-regular btn-outline-secondary" onClick={() => { handleConsent("all") }}>Accept All</Button>
            </Modal.Footer>
        </Modal>
    );
}