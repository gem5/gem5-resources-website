import { Container, Form, Button, InputGroup, FormControl } from "react-bootstrap";
import styles from '/styles/searchbox.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import Image from "next/image";
import searchImage from "public/search.png"

export default function SearchBox({ callback, query = "", setQuery = () => { } }) {
    function handleSubmit(e) {
        e.preventDefault()
        callback(e.target[0].value)
    }

    function onChange(e) {
        setQuery(e.target.value)
        console.log(query)
    }
    return (
        <>
            <Form className="w-100" onSubmit={handleSubmit}>
                <InputGroup>
                    <Form.Control type="text" placeholder="Search" value={query} onChange={(e) => onChange(e)} />
                    <InputGroup.Text>
                        <Button variant="link" type="submit">
                            <Image
                                src={searchImage}
                                alt="Search Icon"
                                height="20"
                                type="submit"
                            />
                        </Button>
                    </InputGroup.Text>
                </InputGroup>
            </Form>
        </>
    )
}