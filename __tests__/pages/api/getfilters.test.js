import { getFilters } from "@/pages/api/getFilters";
import resources from "./resources.json"

const originalEnv = process.env;

global.fetch = jest.fn((url) => {
    if (url.includes("api.gem5")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(
                    {
                        "category": ["simpoint", "file"],
                        "id": "batman",
                        "architecture": ["X86", "ARM"],
                        "tags": [],
                        "resource_version": "1.0.0",
                        "gem5_versions": ["22.0"],
                        "database": "db1",
                    },
            ),
        })
    }

    if (url.includes("resources.json")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(resources),
        })
    }

    return Promise.resolve({
        status: 200,
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
            SOURCES: {
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
            SOURCES: {
                "db1": {
                    dataSource: "gem5-vision",
                    database: "gem5-vision",
                    collection: "versions_test",
                    url: "https://api.gem5.org/api/resources",
                    isMongo: true,
                },
            }
        };
        let result = await getFilters();
        expect(result).toEqual({
            architecture: ["ARM", "X86"],
            category: ["file", "simpoint"],
            gem5_versions: ["22.0"],
            database: ["db1"],
        });
    });
});
