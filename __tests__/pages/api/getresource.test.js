import { getResource } from "@/pages/api/getresource";
import resources from "./resources.json"

const originalEnv = process.env;

global.fetch = jest.fn((url) => {
    if (url.includes("data.mongodb-api")) {
        return Promise.resolve({
            json: () => Promise.resolve({
                'documents': [{
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
                }],
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

describe('getResource', () => {
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

    test("json: getbyID", async () => {
        let result = await getResource("batman");
        expect(result).toEqual({
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
        })
    });

    test("json: getbyID and specific version", async () => {
        let result = await getResource("batman", null, "1.0.0");
        expect(result).toEqual({
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
        })
    });

    test("json: resource does not exist", async () => {
        let result = await getResource("harshilpatel");
        expect(result).toEqual({ error: 'Resource not found' })
    });

    test("json http: find resources", async () => {
        process.env = {
            ...originalEnv,
            BASE_PATH: '',
            PRIVATE_RESOURCES: {
                "db1": {
                    url: "https://raw.githubusercontent.com/Gem5Vision/resources.json",
                    isMongo: false,
                }
            }
        };
        let result = await getResource("batman");
        expect(result).toEqual({
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
        })
    });

    test("mongo: find resources", async () => {
        process.env = {
            ...originalEnv,
            BASE_PATH: '',
            PRIVATE_RESOURCES: {
                "db1": {
                    dataSource: "gem5-vision",
                    database: "gem5-vision",
                    collection: "resources",
                    url: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
                    name: "data-ejhjf",
                    apiKey: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
                    isMongo: true,
                }
            }
        };
        let result = await getResource("batman");
        expect(result).toEqual({
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
        })
    });
});