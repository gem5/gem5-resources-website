import getTabs from "@/pages/api/getTabs";
import schema from "../../schema.json";
import config from "../../../gem5.config.json"
// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(schema),
    })
);
const originalEnv = process.env;

describe("getTabs", () => {
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
            },
            TABS: config.ui.tabs,
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    test("binary tabs", async () => {
        let resource = {
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
            "example_usage": "get_resource(resource_name=\"rv64mi-p-sbreak\")"
        }
        let result = await getTabs(resource);
        let expected = {
            "required": [],
            "additionalInfo": [],
            "meta": []
        }
        expect(result).toEqual(expected);
    });

    test("simpoint tabs", async () => {
        let resource = {
            "category": "simpoint",
            "id": "batman",
            "description": "Simpoints for running the 'x86-print-this' resource with the parameters `\"print this\" 15000`. This is encapsulated in the 'x86-print-this-15000-with-simpoints' workload.",
            "architecture": "X86",
            "size": 10240,
            "tags": [],
            "is_zipped": false,
            "md5sum": "3fcffe3956c8a95e3fb82e232e2b41fb",
            "is_tar_archive": true,
            "url": "http://dist.gem5.org/dist/develop/simpoints/x86-print-this-15000-simpoints-20221013.tar",
            "simpoint_interval": 1000000,
            "warmup_interval": 1000000,
            "code_examples": [],
            "license": "",
            "author": [],
            "source_url": "",
            "resource_version": "1.0.0",
            "gem5_versions": [
                "23.0"
            ],
            "workload_name": "x86-print-this-15000-with-simpoints",
            "example_usage": "get_resource(resource_name=\"x86-print-this-1500-simpoints\")",
            "workloads": [
                "x86-print-this-15000-with-simpoints",
                "x86-print-this-15000-with-simpoints-and-checkpoint"
            ]
        }
        let expected = {
            "required": [],
            "additionalInfo": [
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
                },
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
        }
        let result = await getTabs(resource);
        expect(result).toEqual(expected);
    });
});