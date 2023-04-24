import { getResources } from "@/pages/api/findresources";
import resources from "./resources.json"

const originalEnv = process.env;

global.fetch = jest.fn((url) => {
    if (url.includes("data.mongodb-api")) {
        return Promise.resolve({
            json: () => Promise.resolve({
                'documents': [],
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

describe('findResources', () => {
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

    test("json filters #1 (no query)", async () => {
        let result = await getResources({ query: "", sort: "relevance" }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
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
                    gem5_versions: ["23.0"],
                    workload_name: 'x86-print-this-15000-with-simpoints',
                    example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                    workloads: ["x86-print-this-15000-with-simpoints", "x86-print-this-15000-with-simpoints-and-checkpoint"],
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.0',
                    database: 'db1'
                },
                {
                    category: 'binary',
                    id: 'this-is-a-test-resource',
                    description: 'This is a test resource but double newer',
                    architecture: 'X86',
                    size: 13816,
                    tags: ["asmtest"],
                    is_zipped: false,
                    md5sum: '4e70a98b6976969deffff91eed17fba1',
                    source: 'src/asmtest',
                    url: 'http://dist.gem5.org/dist/develop/test-progs/asmtest/bin/rv64mi-p-sbreak',
                    code_examples: [],
                    license: ' BSD-3-Clause',
                    author: [],
                    source_url: 'https://github.com/gem5/gem5-resources/tree/develop/src/asmtest',
                    resource_version: '2.0.0',
                    gem5_versions: ["23.1"],
                    example_usage: 'get_resource(resource_name="rv64mi-p-sbreak")',
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.1',
                    database: 'db1'
                }
            ],
            total: 2
        });
    });

    test("json filters #2 (no matching results)", async () => {
        let result = await getResources({ category: ["benchmark"], architecture: ["ARM"], gem5_versions: ["23.0"], database: ["db1"], query: "", sort: "relevance", tags: ["asmtest"] }, 1, 10);
        expect(result).toEqual({
            "resources": [],
            "total": 0,
        });
    });

    test("json filters #2.1 (json http)", async () => {
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
        let result = await getResources({ category: ["benchmark"], architecture: ["ARM"], gem5_versions: ["23.0"], database: ["db1"], query: "", sort: "relevance", tags: ["asmtest"] }, 1, 10);
        expect(result).toEqual({
            "resources": [],
            "total": 0,
        });
    });

    test("json filters #2.2 (mongo)", async () => {
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
        let result = await getResources({ category: ["benchmark"], architecture: ["ARM"], gem5_versions: ["23.0"], database: ["db1"], query: "test", sort: "relevance", tags: ["asmtest"] }, 1, 10);
        expect(result).toEqual({
            "resources": [],
            "total": 0,
        });
    });

    test("json filters #2.3 (mongo)", async () => {
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
        let result = await getResources({ category: ["benchmark"], architecture: ["ARM"], gem5_versions: ["23.0"], database: ["db1"], query: "", sort: "relevance", tags: ["asmtest"] }, 1, 10);
        expect(result).toEqual({
            "resources": [],
            "total": 0,
        });
    });

    test("json filters #3 (matching query)", async () => {
        let result = await getResources({ query: "batman", sort: "relevance" }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
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
                    gem5_versions: ["23.0"],
                    workload_name: 'x86-print-this-15000-with-simpoints',
                    example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                    workloads: ["x86-print-this-15000-with-simpoints", "x86-print-this-15000-with-simpoints-and-checkpoint"],
                    totalMatches: 1,
                    score: 90,
                    ver_latest: '23.0',
                    database: 'db1'
                }
            ],
            total: 1
        });
    });


    test("json filters #4 (different sorts)", async () => {
        let result = await getResources({ query: "", sort: "version" }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
                    category: 'binary',
                    id: 'this-is-a-test-resource',
                    description: 'This is a test resource but double newer',
                    architecture: 'X86',
                    size: 13816,
                    tags: ["asmtest"],
                    is_zipped: false,
                    md5sum: '4e70a98b6976969deffff91eed17fba1',
                    source: 'src/asmtest',
                    url: 'http://dist.gem5.org/dist/develop/test-progs/asmtest/bin/rv64mi-p-sbreak',
                    code_examples: [],
                    license: ' BSD-3-Clause',
                    author: [],
                    source_url: 'https://github.com/gem5/gem5-resources/tree/develop/src/asmtest',
                    resource_version: '2.0.0',
                    gem5_versions: ["23.1"],
                    example_usage: 'get_resource(resource_name="rv64mi-p-sbreak")',
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.1',
                    database: 'db1'
                },
                {
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
                    gem5_versions: ["23.0"],
                    workload_name: 'x86-print-this-15000-with-simpoints',
                    example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                    workloads: ["x86-print-this-15000-with-simpoints", "x86-print-this-15000-with-simpoints-and-checkpoint"],
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.0',
                    database: 'db1'
                }
            ],
            total: 2
        });

        result = await getResources({ query: "", sort: "id_desc" }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
                    category: 'binary',
                    id: 'this-is-a-test-resource',
                    description: 'This is a test resource but double newer',
                    architecture: 'X86',
                    size: 13816,
                    tags: ["asmtest"],
                    is_zipped: false,
                    md5sum: '4e70a98b6976969deffff91eed17fba1',
                    source: 'src/asmtest',
                    url: 'http://dist.gem5.org/dist/develop/test-progs/asmtest/bin/rv64mi-p-sbreak',
                    code_examples: [],
                    license: ' BSD-3-Clause',
                    author: [],
                    source_url: 'https://github.com/gem5/gem5-resources/tree/develop/src/asmtest',
                    resource_version: '2.0.0',
                    gem5_versions: ["23.1"],
                    example_usage: 'get_resource(resource_name="rv64mi-p-sbreak")',
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.1',
                    database: 'db1'
                },
                {
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
                    gem5_versions: ["23.0"],
                    workload_name: 'x86-print-this-15000-with-simpoints',
                    example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                    workloads: ["x86-print-this-15000-with-simpoints", "x86-print-this-15000-with-simpoints-and-checkpoint"],
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.0',
                    database: 'db1'
                }
            ],
            total: 2
        });

        result = await getResources({ query: "", sort: "id_asc" }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
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
                    gem5_versions: ["23.0"],
                    workload_name: 'x86-print-this-15000-with-simpoints',
                    example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                    workloads: ["x86-print-this-15000-with-simpoints", "x86-print-this-15000-with-simpoints-and-checkpoint"],
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.0',
                    database: 'db1'
                },
                {
                    category: 'binary',
                    id: 'this-is-a-test-resource',
                    description: 'This is a test resource but double newer',
                    architecture: 'X86',
                    size: 13816,
                    tags: ["asmtest"],
                    is_zipped: false,
                    md5sum: '4e70a98b6976969deffff91eed17fba1',
                    source: 'src/asmtest',
                    url: 'http://dist.gem5.org/dist/develop/test-progs/asmtest/bin/rv64mi-p-sbreak',
                    code_examples: [],
                    license: ' BSD-3-Clause',
                    author: [],
                    source_url: 'https://github.com/gem5/gem5-resources/tree/develop/src/asmtest',
                    resource_version: '2.0.0',
                    gem5_versions: ["23.1"],
                    example_usage: 'get_resource(resource_name="rv64mi-p-sbreak")',
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.1',
                    database: 'db1'
                }
            ],
            total: 2
        });
    });

    test("json filters #5 (fuzzy search)", async () => {
        let result = await getResources({ query: "batmn", sort: "relevance" }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
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
                    gem5_versions: ["23.0"],
                    workload_name: 'x86-print-this-15000-with-simpoints',
                    example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                    workloads: ["x86-print-this-15000-with-simpoints", "x86-print-this-15000-with-simpoints-and-checkpoint"],
                    totalMatches: 1,
                    score: 14,
                    ver_latest: '23.0',
                    database: 'db1'
                }
            ],
            total: 1
        });
    });

    test("json filters #5 (reverse search)", async () => {
        let result = await getResources({ query: "x86-print-this-15000-with-simpoints", sort: "relevance" }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
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
                    gem5_versions: ["23.0"],
                    workload_name: 'x86-print-this-15000-with-simpoints',
                    example_usage: 'get_resource(resource_name="x86-print-this-1500-simpoints")',
                    workloads: ["x86-print-this-15000-with-simpoints", "x86-print-this-15000-with-simpoints-and-checkpoint"],
                    totalMatches: 1,
                    score: 7,
                    ver_latest: '23.0',
                    database: 'db1'
                }
            ],
            total: 1
        });
    });

    test("json filters #6 (search by tag)", async () => {
        let result = await getResources({ query: "", sort: "relevance", tags: ["asmtest"] }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
                    category: 'binary',
                    id: 'this-is-a-test-resource',
                    description: 'This is a test resource but double newer',
                    architecture: 'X86',
                    size: 13816,
                    tags: ["asmtest"],
                    is_zipped: false,
                    md5sum: '4e70a98b6976969deffff91eed17fba1',
                    source: 'src/asmtest',
                    url: 'http://dist.gem5.org/dist/develop/test-progs/asmtest/bin/rv64mi-p-sbreak',
                    code_examples: [],
                    license: ' BSD-3-Clause',
                    author: [],
                    source_url: 'https://github.com/gem5/gem5-resources/tree/develop/src/asmtest',
                    resource_version: '2.0.0',
                    gem5_versions: ["23.1"],
                    example_usage: 'get_resource(resource_name="rv64mi-p-sbreak")',
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.1',
                    database: 'db1'
                }
            ],
            total: 1
        });
    });

    test("json filters #7 (search by gem5_versions and no sort)", async () => {
        let result = await getResources({ query: "", gem5_versions: ["23.1"] }, 1, 10);
        expect(result).toEqual({
            resources: [
                {
                    category: 'binary',
                    id: 'this-is-a-test-resource',
                    description: 'This is a test resource but double newer',
                    architecture: 'X86',
                    size: 13816,
                    tags: ["asmtest"],
                    is_zipped: false,
                    md5sum: '4e70a98b6976969deffff91eed17fba1',
                    source: 'src/asmtest',
                    url: 'http://dist.gem5.org/dist/develop/test-progs/asmtest/bin/rv64mi-p-sbreak',
                    code_examples: [],
                    license: ' BSD-3-Clause',
                    author: [],
                    source_url: 'https://github.com/gem5/gem5-resources/tree/develop/src/asmtest',
                    resource_version: '2.0.0',
                    gem5_versions: ["23.1"],
                    example_usage: 'get_resource(resource_name="rv64mi-p-sbreak")',
                    totalMatches: 2,
                    score: 21,
                    ver_latest: '23.1',
                    database: 'db1'
                }
            ],
            total: 1
        });
    });

});