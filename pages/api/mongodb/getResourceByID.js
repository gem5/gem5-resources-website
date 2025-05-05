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
async function getResourceByID(token, url, id, version = null) {

    let params = new URLSearchParams();
    params.append("id", id)
    if (version == null) {
        params.append("resource_version", version)
    }
    const res = await fetch(`${url}/find-resource-by-id?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            // 'origin': 'https://gem5vision.github.io',
        },
    }).catch(err => console.log(err));
    let resource = await res.json();
    if (res.status != 200 || resource === null || resource.length === 0) {
        return { error: 'Resource not found' }
    }

    resource = resource.sort((a, b) => -compareVersions(a.resource_version, b.resource_version))[0];

    const dependendWorkloads = await fetch(`${url}/get-dependent-workloads?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).catch(err => console.log(err));
    let workloads = await dependendWorkloads.json();
    console.log(workloads)
    resource.workloads_mapping = Object.values(workloads).map(workload => workload['_id']);

    return resource;
}

/**
 * @function getResourceByIDMongoDB
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getResourceByIDMongoDB(id, database = null, version = null) {
    const token = await getToken(database);
    let privateResources = process.env.SOURCES[database];
    const resource = await getResourceByID(token, privateResources.url,id, version);
    resource['database'] = database;
    return resource;
}