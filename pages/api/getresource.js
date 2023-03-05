import getResourceJSON from "./json/getresource";
import getResourceMongoDB from "./mongodb/getresource";

/**
 * @wrapper
 * @async
 * @description Fetches a resource from the MongoDB database or JSON file.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export async function getResource(id) {
    let resource;
    if (process.env.IS_MONGODB_ENABLED) {
        resource = await getResourceMongoDB(id);
    } else {
        resource = await getResourceJSON(id);
    }
    return resource;
}
