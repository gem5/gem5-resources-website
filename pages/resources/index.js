import Head from 'next/head'
import { Col, Row, SSRProvider } from 'react-bootstrap'
import { getResources } from '../api/findresources'
import SearchBox from '@/components/searchbox'
import SearchResult from '@/components/searchresult'
import Filters from '@/components/filters'
import { getFilters } from "../api/getfilters";
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";

export default function Resources(props) {
    const router = useRouter()
    const [search, setSearch] = useState(props.query)

    useEffect(() => {
        setSearch(filterToQuery(props.filters))
    }, [])

    function Results() {
        if (props.resources.length === 0) {
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
                    props.resources.map((resource, index) => (
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
        let searchQuery = search.split(' ').filter((word) => !word.includes(':'))[0];
        if (searchQuery) {
            q += searchQuery;
        }
        return q
    }

    function onChange(filters) {
        let q = filterToQuery(filters)
        setSearch(q)
        router.push({
            pathname: '/resources',
            query: { q: q }
        })
    }

    function onSearch(query) {
        setSearch(query)
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
                    <SearchBox callback={onSearch} query={search} setQuery={setSearch} />
                </div>
                <div style={{ width: '60%' }} >
                    <Row>
                        <Col xs={3} className='filters'>
                            <Filters filters={props.filters} callback={onChange} />
                        </Col>
                        <Col>
                            <Row className='justify-content-between align-items-center'>
                                <div className='w-auto'>
                                    <span className='text-uppercase me-2 text-muted'>
                                        Results
                                    </span>
                                    <span className='primary'>
                                        {props.resources.length}
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
                                <Results />
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </SSRProvider>
    )
}

export async function getServerSideProps({ query }) {
    if (!query.q) {
        query.q = ''
    }
    // query.q might contain something like "category:workload category:kernel query"
    // parse the query and convert to something like category: ["gem5", "gem5art"] query: ["query"]
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
    queryObject["query"] = queryArray.filter(query => !query.includes(":"))[0];
    if (!queryObject["query"]) {
        queryObject["query"] = "";
    }
    const resources = await getResources(queryObject);
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
        props: {
            resources: resources,
            filters: filterModified,
            query: queryObject.query,
            fullQuery: query.q
        }
    };
};