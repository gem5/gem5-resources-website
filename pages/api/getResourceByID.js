import getResourceByIDJSON from "./json/getResourceByID";
import getResourceByIDMongoDB from "./mongodb/getResourceByID";

/**
 * @wrapper
 * @async
 * @description Fetches a resource from the MongoDB database or JSON file.
 * Defaults to first database if none.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export async function getResourceByID(id, database = null, version = null) {
    if (!database) {
        database = Object.keys(process.env.SOURCES)[0];
    }
    if (!process.env.SOURCES[database]) {
        return { error: 'Database not found' }
    }
    let resource;
    if (process.env.SOURCES[database].isMongo) {
        resource = await getResourceByIDMongoDB(id, database, version);
    } else {
        resource = await getResourceByIDJSON(id, database, version);
    }
    return resource;
}
