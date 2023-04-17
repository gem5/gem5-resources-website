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
  if (url.includes("http")) {
    const res = await fetch(
      url,
    ).then((res) => res.json());
    return res;
  }
  else {
    try {
      const path = process.env.BASE_PATH + '/' + url;
      const json = await fetch(path).then((res) => res.json());
      return json;
    } catch (error) {
      return [];
    }
  }
}
