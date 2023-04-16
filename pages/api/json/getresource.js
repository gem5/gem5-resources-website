import fetchResourcesJSON from "./resources";

/**
 * @helper
 * @async
 * @description Fetches a resource from the JSON file.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
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
    let resource = results[0];
    if (!version) {
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
    resource.workloads = workloads;
    resource.database = database;
    return resource;
}
