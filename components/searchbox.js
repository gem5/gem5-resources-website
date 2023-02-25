import { Form, Button, InputGroup } from "react-bootstrap";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import searchImage from "public/search.png"

const SearchBox = forwardRef((props, ref) => {
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (props.query) {
            setSearch(props.query)
        } else {
            setSearch("")
        }
    }, [props.query])

    useImperativeHandle(ref, () => ({
        getSearchQuery
    }))

    function getSearchQuery() {
        return search
    }

    function handleSubmit(e) {
        e.preventDefault()
        props.callback(e.target[0].value)
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