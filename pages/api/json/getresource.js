import fetchResourcesJSON from "./resources";

/**
 * @helper
 * @async
 * @description Fetches a resource from the JSON file.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getResourceJSON(id) {
    const resources = await fetchResourcesJSON();
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
    results[0].workloads = workloads;

    return results[0];
}
