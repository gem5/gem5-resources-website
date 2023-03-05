import { Form, Button } from "react-bootstrap";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import searchImage from "public/search.png"
import { useRouter } from "next/router";

/**
 * @component
 * @description This component is a search box which allows users to input a search query and submit it to a callback function.
 * @param {object} props - The props object.
 * @param {string} props.query - The search query.
 * @param {function} props.callback - The callback function to be executed upon submitting the search query.
 * @returns {JSX.Element} The JSX element representing the search box.
*/
const SearchBox = forwardRef((props, ref) => {
    const [search, setSearch] = useState("")
    const router = useRouter()
    
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
        if (props.callback) {
            props.callback(e.target[0].value)
        } else {
            router.push({
                pathname: '/resources',
                query: { q: e.target[0].value }
            })
        }
    }

    function onChange(e) {
        setSearch(e.target.value)
    }
    return (
        <>
            <Form className={"search-form w-100 " + props.className} onSubmit={handleSubmit}>
                <Form.Control type="text" placeholder="Search Resources" value={search} onChange={(e) => onChange(e)} />
                <Button type="submit" style={{ display: "none" }} id="submit" />
                <Image
                    src={searchImage}
                    alt="Search Icon"
                    height="20"
                    id="search-icon"
                    type="submit"
                    onClick={() => document.getElementById("submit").click()}
                />
            </Form>
        </>
    )
})

SearchBox.displayName = 'SearchBox'

export default SearchBox