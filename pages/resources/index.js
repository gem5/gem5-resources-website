import Head from 'next/head'
import { Button, Col, Form, Row, Spinner, SSRProvider } from 'react-bootstrap'
import { getResources } from '../api/findresources'
import SearchBox from '@/components/searchbox'
import SearchResult from '@/components/searchresult'
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

    const ref = useRef()
    const numberOfItemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [maxPageNumbersShown, setMaxPageNumbersShown] = useState(5);
    const [paginationSize, setPaginationSize] = useState('sm');
    const [total, setTotal] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        let q = window.location.href.split('?')[1]
        if (q) {
            q = q.split('=')[1]
            q = q.split('&')[0]
            q = decodeURIComponent(q)
            q = q.replace(/\+/g, ' ')
            setQuery(q)
            let page = window.location.href.split('?')[1]
            // check if page is present in url
            if (page.includes('page')) {
                console.log('page present')
                page = page.split('=')[2]
                page = page.split('&')[0]
                page = parseInt(page)
                setCurrentPage(page)
            }
        }
    }, [router.query.q])

    useEffect(() => {
        if (query != null) {
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
            qo["sort"] = "relevance";
            setQueryObject(qo);
            console.log(qo);
        }
    }, [query])

    useEffect(() => {
        const fetchFilters = async () => {
            const filters = await getFilters();
            setFilters(filters);
            let filterModified = {};
            for (let filter in filters) {
                let filterObject = {};
                filters[filter].forEach(filterOption => {
                    if (queryObject[filter] && queryObject[filter].includes(filterOption)) {
                        filterObject[filterOption] = true;
                    } else {
                        filterObject[filterOption] = false;
                    }
                }
                );
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

        if (queryObject) {
            fetchFilters();
        }
    }, [queryObject, currentPage]);

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
        // convert filters to query string
        let q = '';
        for (let filter in filters) {
            for (let value in filters[filter]) {
                if (filters[filter][value]) {
                    q += `${filter}:${value} `;
                }
            }
        }
        // let searchQuery = ref.current.getSearchQuery().split(' ').filter((word) => !word.includes(':'));
        let searchQuery = ref.current.getSearchQuery().split(' ').filter((word) => !word.includes(':'));
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
            query: { q: q, page: 1 }
        })
    }

    function onSearch(query) {
        setQuery(query)
        router.push({
            pathname: '/resources',
            query: { q: query, page: 1 }
        })
    }

    function onSortChange(e) {
        setQueryObject({ ...queryObject, sort: e.target.value })
    }

    function onPageChange(page) {
        setCurrentPage(page)
        router.push({
            pathname: '/resources',
            query: { q: query, page: page }
        })
    }

    return (
        <SSRProvider>
            <Head>
                <title>gem5 resources</title>
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
                                    <span className='text-uppercase me-2 text-muted value-label'>
                                        Results
                                    </span>
                                    <span className='primary value' style={{ paddingLeft: "0.50rem" }}>
                                        {total == 0 ? 0 : (currentPage - 1) * numberOfItemsPerPage + 1} - {Math.min(currentPage * numberOfItemsPerPage, total)} of {total}
                                    </span>
                                </div>
                                <div className='w-auto d-flex align-items-center'>
                                    <span className='text-uppercase me-2 text-muted value-label'>
                                        Sort by
                                    </span>
                                    <Form.Select
                                        className='w-auto primary text-uppercase border-0 value'
                                        aria-label="Default select example"
                                        defaultValue='relevance'
                                        onChange={onSortChange}
                                        style={{ paddingLeft: '0.50rem', cursor: 'pointer' }}
                                    >
                                        <option value='relevance'>Relevance</option>
                                        <option value='date'>Date</option>
                                        <option value='version'>Version</option>
                                        <option value='id_asc'>Id Ascending</option>
                                        <option value='id_desc'>Id Descending</option>
                                    </Form.Select>
                                </div>
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
                            <Row>
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
        </SSRProvider>
    )
}

// export async function getServerSideProps({ query }) {
/* Resources.getInitialProps = async ({ query }) => {
    if (!query.q) {
        query.q = ''
    }
    let queryObject = {};
    let queryArray = query.q.split(" ");
    queryArray.forEach(query => {
        let querySplit = query.split(":");
        if (querySplit.length === 2) {
            if (queryObject[querySplit[0]]) {
                queryObject[querySplit[0]].push(querySplit[1]);
            } else {
                queryObject[querySplit[0]] = [querySplit[1]];
            }
        }
    });
    queryObject["query"] = queryArray.filter(query => !query.includes(":"));
    queryObject["query"] = queryObject["query"].join(" ");
    if (!queryObject["query"]) {
        queryObject["query"] = "";
    }
    const resources = await getResourcesMongoDB(queryObject);
    const filters = await getFilters();
    let filterModified = {};
    for (let filter in filters) {
        let filterObject = {};
        filters[filter].forEach(filterOption => {
            if (queryObject[filter] && queryObject[filter].includes(filterOption)) {
                filterObject[filterOption] = true;
            } else {
                filterObject[filterOption] = false;
            }
        }
        );
        filterModified[filter] = filterObject;
    }

    return {
        // props: {
        resources: resources,
        filters: filterModified,
        query: queryObject.query,
        fullQuery: query.q
        // }
    };
}; */