import getToken from "./getToken";
import compareVersions from "../compareVersions";

/**
 * @function
 * @async
 * @description Fetches versions of a resource with a specific ID from a specified data source, database, and collection using a Bearer token for authorization.
 * @param {string} token - The access token used for authorization.
 * @param {string} url - The URL of the API endpoint.
 * @param {string} dataSource - The data source to fetch resources from.
 * @param {string} database - The database to fetch resources from.
 * @param {string} collection - The collection to fetch resources from.
 * @param {string} id - The ID of the resource to retrieve versions for.
 * @returns {Array} - An array of resource versions retrieved from the specified data source, database, and collection, sorted in descending order of resource version.
 * @throws {Error} - Throws an error if the fetch request fails.
 */
async function getVersionsByID(token, url, id) {
    const res = await fetch(`${url}/find-resource-by-id?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            // 'Access-Control-Request-Headers': '*',
            // 'origin': 'https://gem5vision.github.io',

        },
    }).catch(err => console.log(err));
    let resource = await res.json();
    if (res.status != 200 || resource === null) {
        return { error: 'Resource not found' }
    }
    resource = resource.sort((a, b) => -compareVersions(a.resource_version, b.resource_version));

    return resource;
}

/**
 * @function getVersionsByIDMongoDB
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getVersionsByIDMongoDB(id, database = null) {
    if (!database) {
        database = Object.keys(process.env.SOURCES)[0];
    }
    const token = await getToken(database);
    let privateResources = process.env.SOURCES[database];
    const resource = await getVersionsByID(token, privateResources.url, id);
    resource.forEach(res => {
        res['database'] = database;
    });
    return resource;
}
