import getToken from "./getToken";

/**
 * @helper
 * @async
 * @description Fetches all the resources from the MongoDB database.
 * @returns {json} A JSON object containing all the resources.
 */
export default async function fetchResourcesMongoDB() {
  const accessToken = await getToken();
  const res = await fetch(
    `${process.env.MONGODB_URI}/action/find`,
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
        collection: process.env.COLLECTION,
      }),
    }
  ).catch((err) => console.log(err));
  const resources = await res.json();
  return resources["documents"];
}
