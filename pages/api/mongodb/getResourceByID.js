import compareVersions from "../compareVersions";

/**
 * @function
 * @async
 * @description Retrieves a resource by ID from a specified data source, database, and collection.
 * If a version is provided, it retrieves the resource with the matching ID and version.
 * @param {string} url - The base URL of the API.
 * @param {string} id - The ID of the resource to retrieve.
 * @param {string|null} version - The version of the resource to retrieve.
 * If not provided, the latest version will be retrieved.
 * @returns {Object} - The retrieved resource object, including its metadata and associated workloads.
 */
async function getResourceByID(url, id, version = null) {

    let params = new URLSearchParams();
    params.append("id", id)
    if (version == null) {
        params.append("resource_version", version)
    }

    const res = await fetch(`${url}/find-resources-in-batch?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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
    let privateResources = process.env.SOURCES[database];
    const resource = await getResourceByID(privateResources.url,id, version);
    resource['database'] = database;
    return resource;
}