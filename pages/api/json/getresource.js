import fetchResourcesJSON from "./resources";

/**
 * @function getResourceJSON
 * @async
 * @description This function retrieves a resource from a JSON database based on the provided ID, database name, and version.
 * It also retrieves associated workloads that reference the resource, and returns an object containing the resource and its metadata.
 * @param {string} id - The ID of the resource to retrieve.
 * @param {string} database - The name of the JSON database.
 * @param {number} version - The version of the resource to retrieve (optional).
 * @returns {Object} - An object containing the retrieved resource and its metadata, including associated workloads and database name.
 * If the resource is not found, an error message is returned.
 */
export default async function getResourceJSON(id, database, version) {
    const resources = await fetchResourcesJSON(database);
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
                workloads.push(resources[res].id);
            }
        }
    }
    if (workloads.length === 0) {
        workloads = []
    }
    let resource;
    if (!version) {
        resource = results[0];
        // go through the results and find most recent version
        for (let i = 0; i < results.length; i++) {
            if (results[i].resource_version > resource.resource_version) {
                resource = results[i];
            }
        }
    } else {
        for (let i = 0; i < results.length; i++) {
            if (results[i].resource_version === version) {
                resource = results[i];
            }
        }
    }
    if (!resource) {
        return { error: 'Resource not found' }
    }
    resource.workloads = workloads;
    resource.database = database;
    return resource;
}
