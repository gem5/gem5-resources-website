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
            <Accordion alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Category</Accordion.Header>
                    <Accordion.Body>
                        {

                            filterState && Object.keys(filterState.category).map((filter, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={filter}
                                    id={filter}
                                    className="text-capitalize"
                                    checked={filterState.category[filter]}
                                    onChange={(e) => {
                                        let filterModified = { ...filterState };
                                        filterModified.category[filter] = e.target.checked;
                                        setFilterState(filterModified);
                                        callback(filterModified);
                                    }}
                                />
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Group</Accordion.Header>
                    <Accordion.Body>
                        {

                            filterState && Object.keys(filterState.group).map((filter, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={filter}
                                    id={filter}
                                    checked={filterState.group[filter]}
                                    onChange={(e) => {
                                        let filterModified = { ...filterState };
                                        filterModified.group[filter] = e.target.checked;
                                        setFilterState(filterModified);
                                        callback(filterModified);
                                    }}
                                />
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Architecture</Accordion.Header>
                    <Accordion.Body>
                        {
                            filterState && Object.keys(filterState.architecture).map((filter, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={filter}
                                    id={filter}
                                    className="text-capitalize"
                                    checked={filterState.architecture[filter]}
                                    onChange={(e) => {
                                        let filterModified = { ...filterState };
                                        filterModified.architecture[filter] = e.target.checked;
                                        setFilterState(filterModified);
                                        callback(filterModified);
                                    }}
                                />
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Zipped</Accordion.Header>
                    <Accordion.Body>
                        {
                            filterState && Object.keys(filterState.zipped).map((filter, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={filter}
                                    id={filter}
                                    className="text-capitalize"
                                    checked={filterState.zipped[filter]}
                                    onChange={(e) => {
                                        console.log(e.target.checked)
                                        let filterModified = { ...filterState };
                                        filterModified.zipped[filter] = e.target.checked;
                                        setFilterState(filterModified);
                                        callback(filterModified);
                                    }}
                                />
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}