import getToken from "./getToken";

/**
 * @helper
 * @async
 * @description Fetches all the resources from the MongoDB database.
 * @returns {json} A JSON object containing all the resources.
 */
async function fetchResourcesMongoDB() {
  const accessToken = await getToken();
  const res = await fetch(
    "https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/find",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
        "Access-Control-Request-Headers": "*",
        // 'origin': 'https://gem5vision.github.io',
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        dataSource: "gem5-vision",
        database: "gem5-vision",
        collection: "resources",
      }),
    }
  ).catch((err) => console.log(err));
  console.log(res);
  const resources = await res.json();
  return resources["documents"];
}

/**
 * @helper
 * @async
 * @description Fetches all the resources from the JSON file. Hosted on GitHub.
 * @returns {json} A JSON object containing all the resources.
 */
export async function fetchResourcesJSON() {
  console.log("Fetching resources from JSON");
  const res = await fetch(
    "https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/main/resources.json"
  ).then((res) => res.json());
  return res;
}

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

export default async function handler(req, res) {
  const resources = await fetchResources();

  res.status(200).json(resources);
}
