import getVersionsByID from "@/pages/api/getVersionsByID";
import resources from "./resources.json"

const originalEnv = process.env;

global.fetch = jest.fn((url) => {
    if (url.includes("api.gem5")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(
                [
                    {
                        "category": "simpoint",
                        "id": "batman",
                        "architecture": "X86",
                        "tags": [],
                        "resource_version": "1.0.0",
                        "database": "db1"
                    }
                ]
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

describe("getVersions", () => {
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

    test("resource not found", async () => {
        let result = await getVersionsByID("", "");
        expect(result).toEqual({ "error": "Resource not found" });
    });

    test("resource found", async () => {
        let result = await getVersionsByID("this-is-a-test-resource", "db1");
        expect(result).toEqual([{
            "category": "binary",
            "id": "this-is-a-test-resource",
            "description": "This is a test resource but double newer",
            "architecture": "X86",
            "size": 13816,
            "tags": [
                "asmtest"
            ],
            "is_zipped": false,
            "md5sum": "4e70a98b6976969deffff91eed17fba1",
            "source": "src/asmtest",
            "url": "http://dist.gem5.org/dist/develop/test-progs/asmtest/bin/rv64mi-p-sbreak",
            "code_examples": [],
            "license": " BSD-3-Clause",
            "author": [],
            "source_url": "https://github.com/gem5/gem5-resources/tree/develop/src/asmtest",
            "resource_version": "2.0.0",
            "gem5_versions": [
                "23.1"
            ],
            "example_usage": "get_resource(resource_name=\"rv64mi-p-sbreak\")",
            "database": "db1"
        }]);
    });

    test("mongodb resource found", async () => {
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
        let result = await getVersionsByID("batman", "db1");
        expect(result).toEqual([{
            "category": "simpoint",
            "id": "batman",
            "architecture": "X86",
            "tags": [],
            "resource_version": "1.0.0",
            "database": "db1"
        }]);
    });
});