import { fetchResources } from "./resources";
import getToken from "./getToken";

/**
 * @helper
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
async function getResourceMongoDB(id) {
    const token = await getToken();
    const res = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/findOne', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            'Access-Control-Request-Headers': '*',
            // 'origin': 'https://gem5vision.github.io',
            "Authorization": "Bearer " + token,
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

/**
 * @helper
 * @async
 * @description Fetches a resource from the JSON file.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
async function getResourceJSON(id) {
    const resources = await fetchResources();
    // filter json file to find the resources that contain the query in their id
    let results = resources.filter(resource => resource.id === id);
    if (results.length === 0) {
        return { error: 'Resource not found' }
    }
    // find workloads that contain the resource id is a value in resource.resources disctionary
    let workloads = []
    for (let res in resources) {
        for (let r in resources[res].resources) {
            if (resources[res].resources[r] === id) {
                workloads.push(resources[res]);
            }
        }
    }
    console.log(workloads);
    if (workloads.length === 0) {
        workloads = null
    } else {
        results[0].workloads = workloads;
    }
    return results[0];
}

/**
 * @wrapper
 * @async
 * @description Fetches a resource from the MongoDB database or JSON file.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export async function getResource(id) {
    let resource;
    // if (process.env.IS_MONGODB_ENABLED) {
    // resource = await getResourceMongoDB(id);
    // } else {
    resource = await getResourceJSON(id);
    // }
    return resource;
}

export default async function handler(req, res) {
    const { id } = req.query;
    let results = await getResourceMongoDB(id);
    res.status(200).json(results);
}
