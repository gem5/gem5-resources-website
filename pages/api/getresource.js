import getResourceJSON from "./json/getresource";
import getResourceMongoDB from "./mongodb/getresource";

/**
 * @wrapper
 * @async
 * @description Fetches a resource from the MongoDB database or JSON file.
 * Defaults to first database if none.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export async function getResource(id, database = null, version = null) {
    if (!database) {
        database = Object.keys(process.env.PRIVATE_RESOURCES)[0];
    }
    if (!process.env.PRIVATE_RESOURCES[database]) {
        return { error: 'Database not found' }
    }
    let resource;
    if (process.env.PRIVATE_RESOURCES[database].isMongo) {
        resource = await getResourceMongoDB(id, database, version);
    } else {
        resource = await getResourceJSON(id, database, version);
    }
    return resource;
}
