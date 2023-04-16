import getToken from "./getToken";

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
function getFilterPipeline(queryObject) {
  let pipeline = []
  // adding filter by gem5 version if the user has selected one
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
  // getting latest resource version for each resource and removing the rest
  pipeline.push(...getLatestVersionPipeline());
  // adding the filters to the pipeline
  pipeline.push(...getFilterPipeline(queryObject));
  // adding the sorting to the pipeline
  pipeline.push(...getSortPipeline(queryObject));
  // adding the pagination to the pipeline
  pipeline.push(...getPagePipeline(currentPage, pageSize));
  return pipeline;
}

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
 * @helper
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
