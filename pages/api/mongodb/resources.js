import getToken from "./getToken";

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
 * @helper
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
