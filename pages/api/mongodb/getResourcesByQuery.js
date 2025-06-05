/**
 * @function getPipeline
 * @description This function returns a MongoDB aggregation pipeline based on the provided query object,
 * current page number, and page size. The pipeline includes stages for handling search query, filtering, sorting, and pagination.
 * It can be used to construct a MongoDB aggregation pipeline for retrieving filtered and paginated results from a collection based on the given query object.
 * @param {Object} queryObject - The query object containing search query, sort, and filter parameters.
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
  params.append('sort', queryObject.sort);

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
 * @param {string} url - The URL of the data source.
 * @param {Object} queryObject - The query object containing search query, sort, and filter parameters.
 * @param {number} currentPage - The current page number.
 * @param {number} pageSize - The number of documents to display per page.
 * @returns {Array} - An array containing the search results and total count of documents matching the search criteria.
 */
async function getSearchResults(
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
    let documents = responseData.documents
    console.log(documents)
    // If there are no results, return empty array and count 0
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return [[], 0];
    }

    // Calculate the total count
    // Note: The API might return the total count in a different format
    // If the API returns total count separately, this logic should be updated
    const totalCount = responseData.totalCount;
    
    // Return in the same format as the original function
    return [documents, totalCount];
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
  let privateResourceResults = await getSearchResults(
    privateResource.url,
    queryObject,
    currentPage,
    pageSize);
  privateResourceResults[0].forEach((resource) => {
    resource.database = database;
  });

  return privateResourceResults;
}
