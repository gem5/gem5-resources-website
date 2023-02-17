import { Container, Form, Button, InputGroup, FormControl } from "react-bootstrap";
import styles from '/styles/searchbox.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState, setState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import searchImage from "public/search.png"

const SearchBox = forwardRef((props, ref) => {
    const [search, setSearch] = useState(props.query)

    function handleSubmit(e) {
        e.preventDefault()
        console.log(e.target[0].value)
        props.callback(e.target[0].value)
    }

    useImperativeHandle(ref, () => ({
        setSearchQuery,
        getSearchQuery
    }))

    function setSearchQuery(query) {
        setSearch(query)
    }

    function getSearchQuery() {
        return search
    }

    function onChange(e) {
        setSearch(e.target.value)
    }
    return (
        <>
            <Form className="w-100" onSubmit={handleSubmit}>
                <InputGroup>
                    <Form.Control type="text" placeholder="Search" value={search} onChange={(e) => onChange(e)} />
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
})

SearchBox.displayName = 'SearchBox'

export default SearchBox