import fetchResourcesJSON from "./resources";
import compareVersions from "../compareVersions";

/**
 * @function getVersionsJSON
 * @async
 * @description This function retrieves an array of resource objects with different versions from a JSON database based on the provided ID and database name.
 * The retrieved resources are sorted by their resource version in descending order.
 * @param {string} id - The ID of the resource to retrieve different versions for.
 * @param {string} database - The name of the JSON database.
 * @returns {Array<Object>} - An array of resource objects, each representing a different version of the resource, sorted by resource version in descending order.
 * If the resource is not found, an error message is returned.
 */
export default async function getVersionsJSON(id, database) {
    const resources = await fetchResourcesJSON(database);
    // filter json file to find the resources that contain the query in their id
    let results = resources.filter(resource => resource.id === id);
    if (results.length === 0) {
        return { error: 'Resource not found' }
    }
    results.forEach((result) => {
        result.database = database;
    });
    results.sort((a, b) => -compareVersions(a.resource_version, b.resource_version));
    return results;
}