import compareVersions from "../compareVersions";
import getToken from "./getToken";

/**
 * @function
 * @async
 * @description Retrieves a resource by ID from a specified data source, database, and collection.
 * If a version is provided, it retrieves the resource with the matching ID and version.
 * @param {string} token - The access token for authentication.
 * @param {string} url - The base URL of the API.
 * @param {string} dataSource - The name of the data source.
 * @param {string} database - The name of the database.
 * @param {string} collection - The name of the collection.
 * @param {string} id - The ID of the resource to retrieve.
 * @param {string|null} version - The version of the resource to retrieve.
 * If not provided, the latest version will be retrieved.
 * @returns {Object} - The retrieved resource object, including its metadata and associated workloads.
 */
async function getResourceByID(token, url, dataSource, database, collection, id, version = null) {
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
            "filter": version ? {
                "id": id,
                "resource_version": version
            } : {
                "id": id
            }
        })
    }).catch(err => console.log(err));
    let resource = await res.json();
    if (resource['documents'] === null || resource['documents'].length === 0) {
        return { error: 'Resource not found' }
    }

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
                    "$match": {
                        "category": "workload"
                    }
                },
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

    return resource;
}

/**
 * @function getResourceMongoDB
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getResourceMongoDB(id, database = null, version = null) {
    const token = await getToken(database);
    let privateResources = process.env.PRIVATE_RESOURCES[database];
    const resource = await getResourceByID(token, privateResources.url, privateResources.dataSource, privateResources.database, privateResources.collection, id, version);
    resource['database'] = database;
    return resource;
}