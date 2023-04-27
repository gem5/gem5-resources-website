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
 * @function getLatestVersionPipeline
 * @description This function returns a MongoDB aggregation pipeline that can be used
 * to retrieve documents with the latest version based on the "resource_version" field.
 * The pipeline performs several stages to split the "resource_version" into parts, convert them to integers,
 * sort them in descending order, group them by "id" field, and return the document with the latest version along
 * with its "id" and "latest_version" fields.
 * @returns {Array} - An array representing the MongoDB aggregation pipeline to retrieve documents with the latest version.
 */
function getLatestVersionPipeline() {
  let pipeline = [
    {
      $addFields: {
        resource_version_parts: {
          $map: {
            input: {
              $split: ["$resource_version", "."],
            },
            in: { $toInt: "$$this" },
          },
        },
      },
    },
    {
      $sort: {
        id: 1,
        "resource_version_parts.0": -1,
        "resource_version_parts.1": -1,
        "resource_version_parts.2": -1,
        "resource_version_parts.3": -1,
      },
    },
    {
      $group: {
        _id: "$id",
        latest_version: {
          $first: "$resource_version",
        },
        document: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$document",
            {
              id: "$_id",
              latest_version: "$latest_version",
            },
          ],
        },
      },
    },
  ]
  return pipeline;
}

/**
 * @function getSearchPipeline
 * @description This function returns a MongoDB aggregation pipeline that can be used to perform text search
 * on a collection based on the provided query object.
 * The pipeline uses the $search stage to perform compound text search on multiple fields,
 * including "id", "description", "category", "architecture", and "tags".
 * It applies boost to the "id" field to prioritize matching results,
 * and also adds a "score" field to each document to represent the search score.
 * @param {Object} queryObject - The query object containing the search query and options.
 * @param {string} queryObject.query - The search query string.
 * @returns {Array} - An array representing the MongoDB aggregation pipeline to perform text search.
 */
function getSearchPipeline(queryObject) {
  let pipeline = [
    {
      $search: {
        compound: {
          should: [
            {
              text: {
                path: "id",
                query: queryObject.query,
                score: {
                  boost: {
                    value: 10,
                  },
                },
              },
            },
          ],
          must: [
            {
              text: {
                query: queryObject.query,
                path: [
                  "id",
                  "desciption",
                  "category",
                  "architecture",
                  "tags",
                ],
                fuzzy: {
                  maxEdits: 2,
                  maxExpansions: 100,
                },
              },
            },
          ],
        },
      },
    },
    {
      $addFields: {
        score: {
          $meta: "searchScore",
        },
      },
    },
  ];
  return pipeline;
}

/**
 * @function getFilterPipeline
 * @description This function returns a MongoDB aggregation pipeline that can be used to apply filters
 * to a collection based on the provided query object.
 * The pipeline applies filters based on tags, gem5_versions, category, and architecture fields in the documents.
 * It unwinds and matches the specified fields in the query object, and groups the results to eliminate duplicates.
 * The resulting pipeline can be used in conjunction with other aggregation stages to further process the filtered documents.
 * @param {Object} queryObject - The query object containing the filter criteria.
 * @param {Array} queryObject.tags - An array of tags to filter by.
 * @param {Array} queryObject.gem5_versions - An array of gem5 versions to filter by.
 * @param {Array} queryObject.category - An array of categories to filter by.
 * @param {Array} queryObject.architecture - An array of architectures to filter by.
 * @returns {Array} - An array representing the MongoDB aggregation pipeline to apply filters.
 */
function getFilterPipeline(queryObject) {
  let pipeline = []
  // adding filter by gem5 version if the user has selected one
  if (queryObject.tags) {
    pipeline.push(...[
      {
        $addFields: {
          tag: "$tags",
        },
      },
      {
        $unwind: "$tag",
      },
      {
        $match: {
          tag: {
            $in: queryObject.tags || [],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          doc: {
            $first: "$$ROOT",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },
    ]);
  }
  if (queryObject.gem5_versions) {
    pipeline.push(...[
      {
        $addFields: {
          version: "$gem5_versions",
        },
      },
      {
        $unwind: "$version",
      },
      {
        $match: {
          version: {
            $in: queryObject.gem5_versions || [],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          doc: {
            $first: "$$ROOT",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },
    ]);
  }
  // adding the other fileters such as category and architecture to the serch pipeline
  let match = [];
  if (queryObject.category) {
    match.push({ category: { $in: queryObject.category || [] } });
  }
  if (queryObject.architecture) {
    match.push({ architecture: { $in: queryObject.architecture || [] } });
  }
  // adding the match to the pipeline if there are some filters selected
  if (match.length > 0) {
    pipeline.push({
      $match: {
        $and: match,
      },
    });
  }
  return pipeline;
}

/**
 * @function getSortPipeline
 * @description This function returns a MongoDB aggregation pipeline that can be used to apply sorting to a collection based on the provided query object.
 * The pipeline adds a field "ver_latest" to each document in the collection, representing the maximum value in the "gem5_versions" array field.
 * It then sorts the documents based on the specified sort criteria from the query object using the "getSort" helper function.
 * @param {Object} queryObject - The query object containing the sort criteria.
 * @param {string} queryObject.sort - The sort criteria to apply.
 * Should be a string in the format "field:direction", where "field" is the field to sort by and "direction"
 * is the sorting direction ("asc" for ascending, "desc" for descending).
 * @returns {Array} - An array representing the MongoDB aggregation pipeline to apply sorting.
 */
function getSortPipeline(queryObject) {
  let pipeline = [
    {
      $addFields: {
        ver_latest: {
          $max: "$gem5_versions",
        },
      },
    },
    {
      $sort: getSort(queryObject.sort),
    }];
  return pipeline;
}

/**
 * @function getPagePipeline
 * @description This function returns a MongoDB aggregation pipeline that can be used to implement pagination for a collection,
 * based on the provided current page number and page size.
 * The pipeline uses the MongoDB $setWindowFields, $skip, and $limit stages to calculate the total count of documents in the collection,
 * skip the appropriate number of documents based on the current page number and page size, and limit the number of documents returned per page.
 * @param {number} currentPage - The current page number.
 * @param {number} pageSize - The number of documents to display per page.
 * @returns {Array} - An array representing the MongoDB aggregation pipeline to implement pagination.
 */
function getPagePipeline(currentPage, pageSize) {
  let pipeline = [
    {
      $setWindowFields: { output: { totalCount: { $count: {} } } },
    },
    {
      $skip: (currentPage - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
  ];
  return pipeline;
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
  let pipeline = [];
  if (queryObject.query.trim() === "") {
    if (queryObject.sort === "relevance") {
      queryObject.sort = "default";
    }
  }
  // adding search query if something is entered
  if (queryObject.query.trim() !== "") {
    pipeline.push(...getSearchPipeline(queryObject));
  }
  // adding the filters to the pipeline
  pipeline.push(...getFilterPipeline(queryObject));
  // getting latest resource version for each resource and removing the rest
  pipeline.push(...getLatestVersionPipeline());
  // adding the sorting to the pipeline
  pipeline.push(...getSortPipeline(queryObject));
  // adding the pagination to the pipeline
  pipeline.push(...getPagePipeline(currentPage, pageSize));
  return pipeline;
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
  dataSource,
  database,
  collection,
  queryObject,
  currentPage,
  pageSize
) {
  let resources = [];
  const pipeline = getPipeline(queryObject, currentPage, pageSize);
  const res = await fetch(`${url}/action/aggregate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      Authorization: "Bearer " + accessToken,
    },
    // also apply filters on
    body: JSON.stringify({
      dataSource: dataSource,
      database: database,
      collection: collection,
      pipeline: pipeline,
    }),
  }).catch((err) => console.log(err));
  resources = await res.json();
  return [
    resources["documents"],
    resources["documents"].length > 0
      ? resources["documents"][0].totalCount
      : 0,
  ];
}


/**
 * @function getResourcesMongoDB
 * @async
 * @description Fetches the resources based on the query object from the MongoDB database.
 * @param {json} queryObject The query object.
 * @param {json} filters The filters object.
 * @returns {JSX.Element} The JSX element to be rendered.
 */
export default async function getResourcesMongoDB(queryObject, currentPage, pageSize, database) {
  let privateResources = process.env.PRIVATE_RESOURCES
  let privateResource = privateResources[database];
  let privateAccessToken = await getToken(database);
  let privateResourceResults = await getSearchResults(privateAccessToken,
    privateResource.url,
    privateResource.dataSource,
    privateResource.database,
    privateResource.collection,
    queryObject,
    currentPage,
    pageSize);
  privateResourceResults[0].forEach((resource) => {
    resource.database = database;
  });

  return privateResourceResults;
}
