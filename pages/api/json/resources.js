/**
 * @helper
 * @async
 * @description Fetches all the resources from the JSON file. Hosted on GitHub.
 * @returns {json} A JSON object containing all the resources.
 */
export default async function fetchResourcesJSON(database) {
  let url = process.env.PRIVATE_RESOURCES[database].url;
  const res = await fetch(
    url,
  ).then((res) => res.json());
  return res;
}
