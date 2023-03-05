/**
 * @helper
 * @async
 * @description Fetches all the resources from the JSON file. Hosted on GitHub.
 * @returns {json} A JSON object containing all the resources.
 */
export default async function fetchResourcesJSON() {
  const res = await fetch(
    "https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/main/resources.json"
  ).then((res) => res.json());
  return res;
}
