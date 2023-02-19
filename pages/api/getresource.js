import { fetchResources } from "./resources";

export async function getResourceMongoDB(id) {
    const res = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/findOne', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            'Access-Control-Request-Headers': '*',
        },
        body: JSON.stringify({
            "dataSource": "gem5-vision",
            "database": "gem5-vision",
            "collection": "resources",
            "filter": {
                "id": id
            }
        })
    }).catch(err => console.log(err));
    const resource = await res.json();
    if (resource['document'] === null) {
        return { error: 'Resource not found' }
    }
    return resource['document']
}

export async function getResource(id) {
    const resources = await fetchResources();
    // filter json file to find the resources that contain the query in their id
    let results = resources['resources'].filter(resource => resource.id === id);
    if (results.length === 0) {
        return { error: 'Resource not found' }
    }
    let workloads = resources['resources'].filter(resource => {
        if (resource.resources) {
            return Object.keys(resource.resources).map((key) => {
                return resource.resources[key]
            }).includes(id)
        }
    })
    if (workloads.length === 0) {
        workloads = null
    } else {
        results[0].workloads = workloads;
    }
    return results[0];
}

export default async function handler(req, res) {
    const { id } = req.query;
    let results = await getResourceMongoDB(id);
    res.status(200).json(results);
}
