import Head from 'next/head'
import { Button, Col, Row, Spinner, SSRProvider } from 'react-bootstrap'
import { getResources, getResourcesMongoDB } from '../api/findresources'
import SearchBox from '@/components/searchbox'
import SearchResult from '@/components/searchresult'
import Filters from '@/components/filters'
import { getFilters } from "../api/getfilters";
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from "react";

function Resources() {
    const router = useRouter()
    const [query, setQuery] = useState(null)
    const [resources, setResources] = useState([])
    const [filters, setFilters] = useState({})
    const [queryObject, setQueryObject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (router.query.q) {
            setQuery(router.query.q)
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
            setQueryObject(qo);
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
        };

        const fetchResources = async () => {
            setLoading(true);
            const resources = await getResourcesMongoDB(queryObject);
            setResources(resources);
            setLoading(false);
        };
        if (queryObject) {
            fetchFilters();
            fetchResources();
        }
    }, [queryObject])

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
                    resources?.map((resource, index) => (
                        <div key={index}>
                            <SearchResult resource={resource} />
                            <hr />
                        </div>
                    ))
                }
            </div>
        )
    }

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
        let searchQuery = query.split(' ').filter((word) => !word.includes(':'));
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
            query: { q: q }
        })
    }

    function onSearch(query) {
        setQuery(query)
        router.push({
            pathname: '/resources',
            query: { q: query }
        })
    }

    return (
        <SSRProvider>
            <Head>
                <title>gem5 resources</title>
                <meta name="description" content="Find the resource you need" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className='d-flex flex-column gap-4 align-items-center'>
                <div className='p-5 w-100 bg-light'>
                    <SearchBox callback={onSearch} query={query} />
                </div>
                <div className='content'>
                    <Row>
                        <Col xs={3} className='filters'>
                            <Filters filters={filters} callback={onChange} />
                        </Col>
                        <Col>
                            <Row className='justify-content-between align-items-center'>
                                <div className='w-auto'>
                                    <span className='text-uppercase me-2 text-muted'>
                                        Results
                                    </span>
                                    <span className='primary'>
                                        {resources?.length}
                                    </span>
                                </div>
                                <div className='w-auto'>
                                    <span className='text-uppercase me-2 text-muted'>
                                        Sort by
                                    </span>
                                    <span className='text-uppercase primary'>
                                        Relevance
                                    </span>
                                </div>
                            </Row>
                            <Row>
                                {
                                    loading ?
                                        <div className='d-flex flex-column align-items-center justify-content-center p-5'>
                                            <Spinner animation="border" />
                                        </div>
                                        : <Results />
                                }
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

export default Resources