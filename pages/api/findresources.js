import getResourcesMongoDB from "./mongodb/findresources";
import getResourcesJSON from "./json/findresources";

/**
 * @wrapper
 * @async
 * @description Wrapper function to fetch the resources based on the query object.
 * @param {json} queryObject The query object.
 * @param {json} filters The filters to be applied.
 * @returns {json} The resources in JSON format.
 */
export async function getResources(queryObject, currentPage, pageSize) {
  let resources;
  if (process.env.IS_MONGODB_ENABLED) {
    resources = await getResourcesMongoDB(queryObject, currentPage, pageSize);
  } else {
    resources = await getResourcesJSON(queryObject, currentPage, pageSize);
  }
  let total = resources[1];
  resources = resources[0];
  // }
  return {
    resources: resources,
    total: total,
  };
}
