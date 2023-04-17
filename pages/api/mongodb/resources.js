import getToken from "./getToken";

/**
 * @function
 * @async
 * @description Fetches resources from a specified data source, database, and collection using a Bearer token for authorization.
 * @param {string} accessToken - The access token used for authorization.
 * @param {string} url - The URL of the API endpoint.
 * @param {string} dataSource - The data source to fetch resources from.
 * @param {string} database - The database to fetch resources from.
 * @param {string} collection - The collection to fetch resources from.
 * @returns {Array} - An array of resources retrieved from the specified data source, database, and collection.
*/
async function fetchResources(accessToken, url, dataSource, database, collection) {
  const res = await fetch(
    `${url}/action/find`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        dataSource: dataSource,
        database: database,
        collection: collection,
      }),
    }
  ).catch((err) => console.log(err));
  const resources = await res.json();
  return resources["documents"];
}

/**
 * @function fetchResourcesMongoDB
 * @async
 * @description Fetches all the resources from the MongoDB database.
 * @returns {json} A JSON object containing all the resources.
 */
export default async function fetchResourcesMongoDB() {
  console.log(process.env.MONGODB_MAIN);
  // const accessToken = await getToken();
  // const resources = await fetchResources(accessToken, process.env.MONGODB_MAIN.url, process.env.MONGODB_MAIN.dataSource, process.env.MONGODB_MAIN.database, process.env.MONGODB_MAIN.collection);
  let privateResources = process.env.PRIVATE_RESOURCES
  for (let resource in privateResources) {
    let privateResource = privateResources[resource];
    let privateAccessToken = await getToken(resource);
    let privateResourceResults = await fetchResources(privateAccessToken, privateResource.url, privateResource.dataSource, privateResource.database, privateResource.collection);
    privateResourceResults.forEach((privateResourceResult) => {
      privateResourceResult["private"] = resource;
    });
    resources.push(...privateResourceResults);
  }
  return resources;
}
