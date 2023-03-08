import { Accordion, Form } from "react-bootstrap";
// get filters from /pages/api/getfilters.js
import { useState, useEffect } from "react";

/**
 * @component
 * @description A component to render the filters.
 * @param {Object} filters The filters to be rendered.
 * @param {Function} callback The callback function to be called when a filter is changed.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function Filters({ filters, callback }) {
    const [filterState, setFilterState] = useState({});
    useEffect(() => {
        if (filters) {
            setFilterState(filters);
        }
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
                                            className="text-capitalize main-text-regular"
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