import { Accordion, Form } from "react-bootstrap";
// get filters from /pages/api/getfilters.js
import { useState, useEffect } from "react";
export default function Filters({ filters, callback }) {
    const [filterState, setFilterState] = useState(filters);
    useEffect(() => {
        setFilterState(filters);
    }, [filters]);
    return (
        <>
            <Accordion alwaysOpen className="my-accordion">
                {
                    Object.keys(filterState).map((filter, index) => (
                        <Accordion.Item eventKey={index} key={index}>
                            <Accordion.Header>{filter}</Accordion.Header>
                            <Accordion.Body>
                                {
                                    Object.keys(filterState[filter]).map((value, index) => (
                                        <Form.Check
                                            key={index}
                                            type="checkbox"
                                            label={value}
                                            id={value}
                                            className="text-capitalize"
                                            checked={filterState[filter][value]}
                                            onChange={(e) => {
                                                let filterModified = { ...filterState };
                                                filterModified[filter][value] = e.target.checked;
                                                setFilterState(filterModified);
                                                callback(filterModified);
                                            }
                                            }
                                        />
                                    ))
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                }
            </Accordion>
        </>
    )
}