import fetchResourcesJSON from "./json/resources";
import fetchResourcesMongoDB from "./mongodb/resources";

/**
 * @function
 * @async
 * @description Fetches resources either from a MongoDB database or from a JSON file based on the value of the IS_MONGODB_ENABLED environment variable.
 * @returns {Promise} A Promise that resolves to an array of resources.
 */
export async function fetchResources() {
  let resources;
  if (process.env.IS_MONGODB_ENABLED) {
    resources = await fetchResourcesMongoDB();
  } else {
    resources = await fetchResourcesJSON();
  }
  return resources;
}
