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
                {/* <Accordion.Item eventKey="0">
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
                            filterState && Object.keys(filterState.is_zipped).map((filter, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={filter}
                                    id={filter}
                                    className="text-capitalize"
                                    checked={filterState.is_zipped[filter]}
                                    onChange={(e) => {
                                        let filterModified = { ...filterState };
                                        filterModified.is_zipped[filter] = e.target.checked;
                                        setFilterState(filterModified);
                                        callback(filterModified);
                                    }}
                                />
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item> */}
            </Accordion>
        </>
    )
}