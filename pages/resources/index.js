import Head from 'next/head'
import { Col, Form, Row, Spinner } from 'react-bootstrap'
import { getResources } from '../api/findresources'
import SearchBox from '@/components/searchBox'
import SearchResult from '@/components/searchResult'
import Filters from '@/components/filters'
import { getFilters } from "../api/getfilters";
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from "react";
import Paginate from '@/components/paginate'

/**
 * @component
 * @description The resources page. This page is used to search for resources.
 * It uses the searchbox component to get the search query. It also uses the filters
 * component to filter the results. It uses the searchresult component to display the results.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function Resources() {
    const router = useRouter()
    const [query, setQuery] = useState(null)
    const [resources, setResources] = useState([])
    const [filters, setFilters] = useState({})
    const [queryObject, setQueryObject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState("relevance")

    const ref = useRef()
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);
    const [pageCount, setPageCount] = useState(1);
    const [maxPageNumbersShown, setMaxPageNumbersShown] = useState(5);
    const [paginationSize, setPaginationSize] = useState('sm');
    const [total, setTotal] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (router.query) {
            if (router.query.page) {
                let page = parseInt(router.query.page)
                if (currentPage != page) {
                    setCurrentPage(page)
                }
            } else {
                setCurrentPage(1)
            }
            if (router.query.q != null) {
                let q = router.query.q
                q = decodeURIComponent(q)
                q = q.replace(/\+/g, ' ')
                if (query != q) {
                    setQuery(q)
                }
            } else {
                setQuery("")
            }
            if (router.query.limit) {
                let limit = parseInt(router.query.limit)
                if (numberOfItemsPerPage != limit) {
                    setNumberOfItemsPerPage(limit)
                }
            } else {
                setNumberOfItemsPerPage(10)
            }
            if (router.query.sort) {
                let sortQuery = router.query.sort
                if (sortQuery != sort) {
                    setSort(sortQuery)
                }
            } else {
                setSort("relevance")
            }
        }
    }, [router.query])

    useEffect(() => {
        if (query != null && sort != null) {
            let qo = {};
            let queryArray = query.split(" ");
            queryArray.forEach(query => {
                let querySplit = query.split(":");
                if (querySplit.length === 2) {
                    if (qo[querySplit[0]]) {
                        qo[querySplit[0]].push(querySplit[1]);
                    } else {
                        qo[querySplit[0]] = [querySplit[1]];
                    }
                }
            });
            qo["query"] = queryArray.filter(query => !query.includes(":"));
            qo["query"] = qo["query"].join(" ");
            if (!qo["query"]) {
                qo["query"] = "";
            }
            qo["sort"] = sort;
            setQueryObject(qo);
        }
    }, [query, sort])

    const [databaseFilters, setDatabaseFilters] = useState({});

    useEffect(() => {
        getFilters().then(filters => {
            let filterModified = {};
            for (let filter in filters) {
                let filterObject = {};
                filters[filter].forEach(filterOption => {
                    filterObject[filterOption] = false;
                }
                );
                filterModified[filter] = filterObject;
            }
            setDatabaseFilters(filterModified);
        })
    }, []);



    useEffect(() => {
        const fetchFilters = async () => {
            let filterModified = {};
            for (let filter in databaseFilters) {
                let filterObject = {};
                for (let filterOption in databaseFilters[filter]) {
                    if (queryObject[filter] && queryObject[filter].includes(filterOption)) {
                        filterObject[filterOption] = true;
                    } else {
                        filterObject[filterOption] = false;
                    }
                }
                filterModified[filter] = filterObject;
            }
            setFilters(filterModified);
            setLoading(true);
            const res = await getResources(queryObject, currentPage, numberOfItemsPerPage);
            setResources(res.resources);
            setTotal(res.total);
            setPageCount(Math.ceil(res.total / numberOfItemsPerPage));
            setLoading(false);
        };

        if (queryObject && Object.keys(databaseFilters).length > 0 && currentPage && numberOfItemsPerPage) {
            fetchFilters();
        }
    }, [queryObject, currentPage, numberOfItemsPerPage, databaseFilters]);

    useEffect(() => {
        function pageNumbersOnResize() {
            if (window.innerWidth < 768) {
                setMaxPageNumbersShown(5);
                setPaginationSize("sm");
            } else {
                setMaxPageNumbersShown(10);
                setPaginationSize(null);
            }
        }
        pageNumbersOnResize();
        window.addEventListener("resize", pageNumbersOnResize);
        return () => { window.removeEventListener("resize", pageNumbersOnResize) }
    }, []);

    function Results() {
        if (resources?.length === 0) {
            return (
                <>
                    <hr />
                    <div className='d-flex flex-column align-items-center justify-content-center p-5'>
                        <h1 className='text-muted'>No results found</h1>
                    </div >
                </>
            )
        }
        return (
            <div>
                {
                    resources.map((resource, index) => (
                        <div key={index}>
                            <SearchResult resource={resource} />
                            <hr />
                        </div>
                    ))
                }
            </div>
        )
    }

    useEffect(() => {
        function onMobileResize() { window.innerWidth <= 425 ? setIsMobile(true) : setIsMobile(false); }
        onMobileResize();
        window.addEventListener("resize", onMobileResize);
        return () => { window.removeEventListener("resize", onMobileResize) }
    }, [])

    function filterToQuery(filters) {
        let q = '';
        for (let filter in filters) {
            for (let value in filters[filter]) {
                if (filters[filter][value]) {
                    q += `${filter}:${value} `;
                }
            }
        }
        let searchQuery = ref.current.getSearchQuery().split(' ').filter((word) => {
            if (word.includes(':')) {
                let split = word.split(':');
                if (split[0] === 'tags') {
                    return true;
                }
                return false;
            }
            return false;
        });
        searchQuery = searchQuery.join(' ');
        if (searchQuery) {
            q += searchQuery;
        }
        return q
    }

    function onChange(filters) {
        let q = filterToQuery(filters)
        router.push({
            pathname: '/resources',
            query: { q: q, page: 1, sort: queryObject.sort, limit: numberOfItemsPerPage }
        }, undefined, { shallow: true })
    }

    function onSearch(query) {
        router.push({
            pathname: '/resources',
            query: { q: query, page: 1, sort: queryObject.sort, limit: numberOfItemsPerPage }
        }, undefined, { shallow: true })
    }

    function onSortChange(e) {
        router.push({
            pathname: '/resources',
            query: { q: query, page: currentPage, sort: e.target.value, limit: numberOfItemsPerPage }
        }, undefined, { shallow: true })
    }

    function onPageChange(page) {
        router.push({
            pathname: '/resources',
            query: { q: query, page: page, sort: queryObject.sort, limit: numberOfItemsPerPage }
        }, undefined, { shallow: true })
    }

    return (
        <>
            <Head>
                <title>Search Resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className={`d-flex flex-column ${isMobile ? null : "gap-4"} align-items-center`}>
                <div className={`${isMobile ? "p-4" : "p-5"} w-100 bg-light`}>
                    <SearchBox callback={onSearch} query={query} ref={ref} />
                </div>
                <div className={`${isMobile ? "p-4" : null} content`}>
                    <Row>
                        <Col xs={3} className='filters'>
                            <Filters filters={filters} callback={onChange} />
                        </Col>
                        <Col>
                            <Row className='justify-content-between align-items-center mb-1 results-sortBy-row'>
                                <div className='w-auto'>
                                    <span className='text-uppercase me-2 text-muted main-text-bold'>
                                        Results
                                    </span>
                                    <span className='primary main-text-semi' style={{ paddingLeft: "0.50rem" }}>
                                        {total == 0 ? 0 : (currentPage - 1) * numberOfItemsPerPage + 1} - {Math.min(currentPage * numberOfItemsPerPage, total)} of {total}
                                    </span>
                                </div>
                                <Form.Select
                                    //value 
                                    className='w-auto primary border-0 main-text-semi'
                                    value={numberOfItemsPerPage?.toString()}
                                    onChange={(value) => {
                                        // if the page is more than the max page number, set the page to the max page number
                                        if (currentPage > Math.ceil(total / parseInt(value.target.value))) {
                                            setNumberOfItemsPerPage(parseInt(value.target.value));
                                            setCurrentPage(Math.ceil(total / parseInt(value.target.value)))
                                            router.push({
                                                pathname: '/resources',
                                                query: { q: query, page: Math.ceil(total / parseInt(value.target.value)), limit: parseInt(value.target.value) }
                                            })
                                        }
                                        else {
                                            setNumberOfItemsPerPage(parseInt(value.target.value));
                                            router.push({
                                                pathname: '/resources',
                                                query: { q: query, page: currentPage, limit: parseInt(value.target.value) }
                                            })
                                        }
                                    }}
                                    style={{ cursor: 'pointer', height: 'fit-content', paddingRight: '1.75rem' }}
                                >
                                    <option value='10'>10 per page</option>
                                    <option value='25'>25 per page</option>
                                    <option value='50'>50 per page</option>
                                    <option value='100'>100 per page</option>
                                </Form.Select>
                                <Form.Group className='w-auto d-flex align-items-center justify-content-center'>
                                    <Form.Label className='text-uppercase me-2 text-muted main-text-bold m-0' htmlFor="sort">
                                        Sort by
                                    </Form.Label>
                                    <Form.Select
                                        name='sort'
                                        className='w-auto primary text-uppercase border-0 main-text-semi'
                                        aria-label="Sort Resources"
                                        value={sort}
                                        onChange={onSortChange}
                                        style={{ paddingLeft: '0.50rem', cursor: 'pointer' }}
                                    >
                                        <option value='relevance'>Relevance</option>
                                        <option value='version'>Version</option>
                                        <option value='id_asc'>Resource ID Ascending</option>
                                        <option value='id_desc'>Resource ID Descending</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row className='mt-2'>
                                {
                                    loading ?
                                        <div className='d-flex flex-column align-items-center justify-content-center p-5'>
                                            <Spinner animation="border" />
                                        </div>
                                        : <Results />
                                }
                            </Row>
                            <Row style={{ justifyContent: 'space-around' }} className='pagingContainer'>
                                <Paginate
                                    pageCount={pageCount}
                                    currentPage={currentPage}
                                    maxPageNumbersShown={maxPageNumbersShown}
                                    setCurrentPage={onPageChange}
                                    paginationSize={paginationSize}
                                />
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}