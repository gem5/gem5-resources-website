import { render, act, screen, waitFor } from '@testing-library/react'
import Resource from '@/pages/resources/[id]/[[...page]]'

global.fetch = jest.fn((url) => {
    if (url.includes("data.mongodb-api")) {
        return Promise.resolve({
            json: () => Promise.resolve({
                'documents': [
                    {
                        "category": ["simpoint", "file"],
                        "id": "batman",
                        "architecture": ["X86", "ARM", null],
                        "tags": [],
                        "resource_version": "1.0.0",
                        "gem5_versions": ["22.0"],
                        "database": "db1",
                    },
                ]
            }),
        })
    }

    if (url.includes("resources.json")) {
        return Promise.resolve({
            json: () => Promise.resolve(resources),
        })
    }

    if (url.includes("realm.mongodb.com")) {
        return Promise.resolve({
            json: () => Promise.resolve({
                "access_token": ""
            }),
        })
    }

    return Promise.resolve({
        json: () => Promise.resolve({
            "error": "Resource not found"
        }),
    })
});

// Mock the MetaData and ResourceTab components
jest.mock('../../../../components/resourceMetadata', () => () => {
    return <div />;
})

jest.mock('../../../../components/resourceBanner', () => () => {
    return <div />;
})

jest.mock('../../../../components/resourceTab', () => () => {
    return <div />;
})

jest.mock('@/pages/api/getTabs', () => ({
    default: jest.fn().mockReturnValue({
        "required": [
            {
                "name": "simpoint_interval",
                "schema": {
                    "type": "integer",
                    "description": "The interval between simpoints",
                    "default": 0
                },
                "content": 1000000
            },
            {
                "name": "warmup_interval",
                "schema": {
                    "type": "integer",
                    "description": "The warmup interval",
                    "default": 0
                },
                "content": 1000000
            }
        ],
        "optional": [
            {
                "name": "workload_name",
                "schema": {
                    "type": "string",
                    "description": "The name of the workload",
                    "default": ""
                },
                "content": "x86-print-this-15000-with-simpoints"
            }
        ],
        "meta": []
    })
}))

jest.mock("next/router", () => ({
    useRouter() {
        return {
            asPath: "localhost:3000/resources/batman",
            query: {},
            isReady: true,
        };
    },
}));
delete window.location;
let replace = jest.fn();
window.location = { replace: replace };


const originalEnv = process.env;

describe("Resource-specific component", () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            BASE_PATH: '',
            PRIVATE_RESOURCES: {
                "db1": {
                    url: "resources.json",
                    isMongo: false,
                }
            }
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    test("renders the resources page", async () => {
        await act(async () => {
            render(<Resource />);
        });
    });

    test("renders the 404 page if error resource", async () => {
        jest.mock('../../../../pages/api/getresource', () => ({
            getResource: jest.fn(() => Promise.resolve({
                category: 'simpoint',
                id: 'batman',
                description: 'Simpoints for running the \'x86-print-this\' resource with the parameters `"print this" 15000`. This is encapsulated in the \'x86-print-this-15000-with-simpoints\' workload.',
                architecture: 'X86',
                size: 10240,
                tags: [],
                is_zipped: false,
                md5sum: '3fcffe3956c8a95e3fb82e232e2b41fb',
                is_tar_archive: true,
                url: 'http://dist.gem5.org/dist/develop/simpoints/x86-print-this-15000-simpoints-20221013.tar',
                simpoint_interval: 1000000,
                warmup_interval: 1000000,
                code_examples: [],
                license: '',
                author: [],
                source_url: '',
                resource_version: '1.0.0',
                gem5_versions: ['23.0'],
                workload_name: 'x86-print-this-15000-with-simpoints',
                example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                workloads: [],
                database: 'db1'
            }))
        }))
        await act(async () => {
            render(<Resource />);
        });
    });

    test("renders the 404 page if error resource", async () => {
        jest.mock('../../../../pages/api/getresource', () => ({
            getResource: jest.fn(() => Promise.resolve({
                error: "Resource not found"
            }))
        }))
        await act(async () => {
            render(<Resource />);
        });
        // check if replace is called 
        await waitFor(() => expect(replace).toHaveBeenCalledWith("/404"));
    });
});