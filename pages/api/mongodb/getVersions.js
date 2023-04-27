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
async function getVersionsByID(token, url, dataSource, database, collection, id) {
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
    if (resource['documents'] === null) {
        return { error: 'Resource not found' }
    }
    resource = resource['documents'].sort((a, b) => -compareVersions(a.resource_version, b.resource_version));

    return resource;
}

/**
 * @function getVersionsMongoDB
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getVersionsMongoDB(id, database = null) {
    if (!database) {
        database = Object.keys(process.env.PRIVATE_RESOURCES)[0];
    }
    const token = await getToken(database);
    let privateResources = process.env.PRIVATE_RESOURCES[database];
    const resource = await getVersionsByID(token, privateResources.url, privateResources.dataSource, privateResources.database, privateResources.collection, id);
    resource.forEach(res => {
        res['database'] = database;
    });
    return resource;
}