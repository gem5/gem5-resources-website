import getResourcesMongoDB from "./mongodb/findresources";
import getResourcesJSON from "./json/findresources";
import compareVersions from "./compareVersions";

/**
 * @wrapper
 * @async
 * @description Wrapper function to fetch the resources based on the query object.
 * @param {json} queryObject The query object.
 * @param {int} currentPage The current page.
 * @param {int} pageSize The size of the page.
 * @returns {json} The resources in JSON format.
 */
export async function getResources(queryObject, currentPage, pageSize) {
  let privateResources = process.env.PRIVATE_RESOURCES
  let databases = queryObject.database;
  let resources = [[], 0];
  if (!databases) {
    databases = Object.keys(privateResources);
  }
  let nPrivate = databases.length;
  let nPerPage = Math.ceil(pageSize / (nPrivate));
  for (let resource in privateResources) {
    if (databases.indexOf(resource) === -1) {
      continue;
    }
    let privateResourceResults = [[], 0];
    if (privateResources[resource].isMongo) {
      privateResourceResults = await getResourcesMongoDB(queryObject, currentPage, nPerPage, resource);
    } else {
      privateResourceResults = await getResourcesJSON(queryObject, currentPage, nPerPage, resource);
    }
    resources[0] = resources[0].concat(privateResourceResults[0]);
    resources[1] = resources[1] + privateResourceResults[1];

    nPrivate--;
    nPerPage = Math.ceil((pageSize - resources[0].length) / (nPrivate));
  }
  // sort the resources based on the query
  switch (queryObject.sort) {
    case "version":
      resources[0].sort((a, b) => -compareVersions(a.ver_latest ?? "0.0", b.ver_latest ?? "0.0"));
      break;
    case "id_asc":
      resources[0].sort((a, b) => a.id < b.id ? -1 : 1);
      break;
    case "id_desc":
      resources[0].sort((a, b) => a.id < b.id ? 1 : -1);
      break;
    default:
      resources[0].sort((a, b) => a.score < b.score ? 1 : -1);
      break;
  }
  return {
    resources: resources[0],
    total: resources[1],
  };
}
