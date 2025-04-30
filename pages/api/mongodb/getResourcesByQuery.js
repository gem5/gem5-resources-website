import getToken from "./getToken";

/**
 * @function getSort
 * @description This function returns a sort object based on the provided sort parameter.
 * The returned sort object can be used in a MongoDB query to specify the sorting order of the results.
 * @param {string} sort - The sort parameter to determine the sorting order.
 * Possible values are: "date" to sort by date in descending order,
 * "name" to sort by name (or ID) in ascending order,
 * "version" to sort by version in descending order,
 * "id_asc" to sort by ID in ascending order,
 * "id_desc" to sort by ID in descending order.
 * If not provided or an invalid value is provided, resources will be sorted by score in descending order by default.
 * @returns {Object} - A sort object that can be used in a MongoDB query to specify the sorting order of the results.
 * @property {number} date - If "date" is provided as the sort parameter,
 * the value of this property will be -1 to sort by date in descending order.
 * @property {number} id - If "name", "id_asc", or "id_desc" is provided as the sort parameter,
 * the value of this property will be either 1 or -1 to specify the sorting order of the ID field.
 * @property {number} ver_latest - If "version" is provided as the sort parameter,
 * the value of this property will be -1 to sort by version in descending order.
 * @property {number} score - If an invalid or no sort parameter is provided,
 * the value of this property will be -1 to sort by score in descending order by default.
 */
function getSort(sort) {
  switch (sort) {
    case "date":
      return { date: -1 };
    case "name":
      return { id: 1 };
    case "version":
      return { ver_latest: -1 };
    case "id_asc":
      return { id: 1 };
    case "id_desc":
      return { id: -1 };
    default:
      return {
        score: -1,
      };
  }
}

/**
 * @function getPipeline
 * @description This function returns a MongoDB aggregation pipeline based on the provided query object,
 * current page number, and page size. The pipeline includes stages for handling search query, filtering, sorting, and pagination.
 * It can be used to construct a MongoDB aggregation pipeline for retrieving filtered and paginated results from a collection based on the given query object.
 * @param {Object} queryObject - The query object containing search query, sort, and filter parameters.
 * @param {string} queryObject.query - The search query.
 * @param {string} queryObject.sort - The sorting parameter.
 * @param {number} currentPage - The current page number.
 * @param {number} pageSize - The number of documents to display per page.
 * @returns {Array} - An array representing the MongoDB aggregation pipeline for retrieving filtered and paginated results.
 */

function getPipeline(queryObject, currentPage, pageSize) {
  // Initialize URL parameters
  let params = new URLSearchParams();

  if (queryObject.query.trim() === "") {
    if (queryObject.sort === "relevance") {
      queryObject.sort = "default";
    }
  }
  // Add search term (contains-str)
  if (queryObject.query && queryObject.query.trim() !== "") {
    params.append('contains-str', queryObject.query.trim());
  } else {
    // Default empty search term
    params.append('contains-str', '');
  }

  // Add filter criteria (must-include)
  const filterParams = buildMustIncludeParams(queryObject);
  if (filterParams) {
    params.append('must-include', filterParams);
  }

  // Add pagination parameters
  params.append('page', currentPage);
  params.append('page-size', pageSize);

  // Add sort parameter if provided
  const sortParam = getSort(queryObject.sort);
  if (sortParam !== "default") {
    params.append('sort', sortParam);
  }

  return params;
}
/**
 * @function buildMustIncludeParams
 * @description Converts filter object from the queryObject to the API's must-include format.
 * Format: field1,value1,value2;field2,value1,value2
 * @param {Object} queryObject - The query object containing filter criteria.
 * @returns {string} - Formatted filter string for the API.
 */
function buildMustIncludeParams(queryObject) {
  const filters = [];
  
  // Handle tags filter
  if (queryObject.tags && queryObject.tags.length > 0) {
    filters.push(`tags,${queryObject.tags.join(',')}`);
  }
  
  // Handle gem5_versions filter
  if (queryObject.gem5_versions && queryObject.gem5_versions.length > 0) {
    filters.push(`gem5_versions,${queryObject.gem5_versions.join(',')}`);
  }
  
  // Handle category filter
  if (queryObject.category && queryObject.category.length > 0) {
    filters.push(`category,${queryObject.category.join(',')}`);
  }
  
  // Handle architecture filter
  if (queryObject.architecture && queryObject.architecture.length > 0) {
    filters.push(`architecture,${queryObject.architecture.join(',')}`);
  }
  
  return filters.join(';');
}

/**
 * @function getSearchResults
 * @async
 * @description This asynchronous function fetches search results from a specified data source using MongoDB aggregation pipeline.
 * It takes in an access token, URL, data source, database, collection, query object, current page number, and page size as input parameters,
 * and returns an array containing the search results and total count of documents matching the search criteria.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} url - The URL of the data source.
 * @param {string} dataSource - The name of the data source.
 * @param {string} database - The name of the database.
 * @param {string} collection - The name of the collection.
 * @param {Object} queryObject - The query object containing search query, sort, and filter parameters.
 * @param {string} queryObject.query - The search query.
 * @param {string} queryObject.sort - The sorting parameter.
 * @param {number} currentPage - The current page number.
 * @param {number} pageSize - The number of documents to display per page.
 * @returns {Array} - An array containing the search results and total count of documents matching the search criteria.
 */
async function getSearchResults(
  accessToken,
  url,
  queryObject,
  currentPage,
  pageSize
) {
  try {
    // Build the query parameters
    const params = getPipeline(queryObject, currentPage, pageSize);
    // Make the API call to the new endpoint
    const res = await fetch(`${url}/search?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "x-functions-key": accessToken, // Using API token as x-functions-key for Azure Functions
      },
    });
    
    // Check if status is not 200
    if (res.status !== 200) {
      console.log("Error: " + res.status);
      return [[], 0];
    }
    
    // Parse the response
    const responseData = await res.json();
    console.log(responseData)
    // If there are no results, return empty array and count 0
    if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
      return [[], 0];
    }

    // Calculate the total count
    // Note: The API might return the total count in a different format
    // If the API returns total count separately, this logic should be updated
    const totalCount = responseData.length;
    
    // Return in the same format as the original function
    return [responseData, totalCount];
  } catch (err) {
    console.log("Error fetching resources:", err);
    return [[], 0];
  }
}


/**
 * @function getResourcesByQueryMongoDB
 * @async
 * @description Fetches the resources based on the query object from the MongoDB database.
 * @param {json} queryObject The query object.
 * @param {json} filters The filters object.
 * @returns {JSX.Element} The JSX element to be rendered.
 */
export default async function getResourcesByQueryMongoDB(queryObject, currentPage, pageSize, database) {
  let privateResources = process.env.SOURCES;
  let privateResource = privateResources[database];
  let privateAccessToken = await getToken(database);
  let privateResourceResults = await getSearchResults(privateAccessToken,
    privateResource.url,
    queryObject,
    currentPage,
    pageSize);
  privateResourceResults[0].forEach((resource) => {
    resource.database = database;
  });

  return privateResourceResults;
}
