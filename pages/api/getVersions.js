import getVersionsJSON from "./json/getVersions";
import getVersionsMongoDB from "./mongodb/getVersions";

/**
 * @function getVersions
 * @description This function retrieves versions of a resource with the given ID from the specified database.
 * The type of database is determined by the value of `isMongo` property in the `PRIVATE_RESOURCES` environment variable.
 * If `isMongo` is `true`, it calls the `getVersionsMongoDB` function to fetch versions from a MongoDB database.
 * Otherwise, it calls the `getVersionsJSON` function to fetch versions from a JSON file.
 * @param {string} id - The ID of the resource to fetch versions for.
 * @param {string} database - The name of the database to fetch versions from.
 * @returns {Promise} - A Promise that resolves to the versions of the resource.
 */
export default async function getVersions(id, database) {
    try {
        if (process.env.PRIVATE_RESOURCES[database].isMongo) {
            return await getVersionsMongoDB(id, database);
        }
        else {
            return await getVersionsJSON(id, database);
        }
    } catch (error) {
        return { error: "Resource not found" };
    }
}