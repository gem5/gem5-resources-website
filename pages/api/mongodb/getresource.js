import getToken from "./getToken";
import { compareVersions } from "./getVersions";
async function getResourceByID(token, url, dataSource, database, collection, id) {
    const res = await fetch(`${url}/action/find`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            'Access-Control-Request-Headers': '*',
            // 'origin': 'https://gem5vision.github.io',
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            "dataSource": dataSource,
            "database": database,
            "collection": collection,
            "filter": {
                "id": id
            }
        })
    }).catch(err => console.log(err));
    let resource = await res.json();
    if (resource['documents'] === null || resource['documents'].length === 0) {
        return { error: 'Resource not found' }
    }
    console.log(resource['documents']);

    resource = resource['documents'].sort((a, b) => -compareVersions(a.resource_version, b.resource_version))[0];

    const dependendWorkloads = await fetch(`${url}/action/aggregate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            "dataSource": dataSource,
            "database": database,
            "collection": collection,
            "pipeline": [
                {
                    "$addFields": {
                        "resources": {
                            "$objectToArray": "$resources"
                        }
                    }
                },
                {
                    "$unwind": "$resources"
                },
                {
                    "$match": {
                        "resources.v": id
                    }
                },
                {
                    "$group": {
                        "_id": "$id",
                    }
                }
            ]
        })
    }).catch(err => console.log(err));
    let workloads = await dependendWorkloads.json();
    resource.workloads = Object.values(workloads['documents']).map(workload => workload['_id']);

    return resource
}

/**
 * @helper
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getResourceMongoDB(id, database = null) {
    if (!database) {
        /* const token = await getToken();
        const resource = await getResourceByID(token, process.env.MONGODB_MAIN.url, process.env.MONGODB_MAIN.dataSource, process.env.MONGODB_MAIN.database, process.env.MONGODB_MAIN.collection, id);
        return resource; */
        database = Object.keys(process.env.PRIVATE_RESOURCES)[0];
    }
    const token = await getToken(database);
    let privateResources = process.env.PRIVATE_RESOURCES[database];
    const resource = await getResourceByID(token, privateResources.url, privateResources.dataSource, privateResources.database, privateResources.collection, id);
    resource['database'] = database;
    return resource;
}