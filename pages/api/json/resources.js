/**
 * @function fetchResourcesJSON
 * @async
 * @description This function fetches and retrieves a JSON file from a specified URL based on the provided database name.
 * The retrieved JSON data represents resources.
 * @param {string} database - The name of the database to fetch the resources from.
 * @returns {Promise<Object>} - A Promise that resolves to the fetched JSON data representing resources.
 */
export default async function fetchResourcesJSON(database) {
  let url = process.env.PRIVATE_RESOURCES[database].url;
  const res = await fetch(
    url,
  ).then((res) => res.json());
  return res;
}
