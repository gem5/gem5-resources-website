import { getFilters } from "@/pages/api/getfilters";
import resources from "./resources.json"
import { get } from "fetch-mock";

const originalEnv = process.env;

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


describe('getFilters', () => {
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

    test("json filters", async () => {
        let result = await getFilters();
        expect(result).toEqual({
            "architecture": ["X86"],
            "category": ["binary", "file", "simpoint"],
            "database": ["db1"],
            "gem5_versions": ["23.1", "23.0"]
        });
    });

    test("mongodb filters", async () => {
        process.env = {
            ...originalEnv,
            PRIVATE_RESOURCES: {
                "db1": {
                    dataSource: "gem5-vision",
                    database: "gem5-vision",
                    collection: "versions_test",
                    url: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
                    name: "data-ejhjf",
                    apiKey: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
                    isMongo: true,
                },
            }
        };
        let result = await getFilters();
        expect(result).toEqual({
            architecture: ["ARM","X86"],
            category: ["file", "simpoint"],
            gem5_versions: ["22.0"],
            database: ["db1"],
        });
    });
});
