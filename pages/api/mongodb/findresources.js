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
    case "default":
      return {
        _id: -1,
      };
    default:
      return {
        score: -1,
      };
  }
}

async function getSearchResults(accessToken, url, dataSource, database, collection, queryObject, currentPage, pageSize) {
  let resources = [];
  if (queryObject.query.trim() === "") {
    if (queryObject.sort === "relevance") {
      queryObject.sort = "default";
    }
  }
  let pipeline = [];
  if (queryObject.tags) {
    pipeline = pipeline.concat([
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
  pipeline = pipeline.concat([
    {
      $addFields: {
        a: "$versions.version",
        ver_latest: {
          $last: "$versions.version",
        },
      },
    },
  ]);
  let match = [];
  if (queryObject.category) {
    match.push({ category: { $in: queryObject.category || [] } });
  }
  if (queryObject.architecture) {
    match.push({ architecture: { $in: queryObject.architecture || [] } });
  }
  if (queryObject.versions) {
    match.push({ "versions.version": { $in: queryObject.versions || [] } });
  }
  if (match.length > 0) {
    pipeline.push({
      $match: {
        $and: match,
      },
    });
  }
  pipeline = pipeline.concat([
    {
      $sort: getSort(queryObject.sort),
    },
    {
      $unset: ["a", "ver_latest"],
    },
    {
      $setWindowFields: { output: { totalCount: { $count: {} } } },
    },
    {
      $skip: (currentPage - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
  ]);

  if (queryObject.query.trim() !== "") {
    // find score greater than 0.5
    /* pipeline.unshift({
      $match: {
        score: {
          $gt: 0.5,
        },
      },
    }); */
    pipeline.unshift({
      "$addFields": {
        "score": {
          "$meta": "searchScore"
        }
      }
    });

    pipeline.unshift({
      $search: {
        compound: {
          should: [
            {
              text: {
                "path": "id",
                "query": queryObject.query,
                "score": {
                  "boost": {
                    "value": 10
                  }
                }
              }
            },
          ],
          must: [{
            text: {
              query: queryObject.query,
              path: ["id", "desciption", "category", "architecture", "tags"],
              fuzzy: {
                maxEdits: 2,
                maxExpansions: 100,
              },
            },
          }],
        },
      }
    });
  }
  const res = await fetch(
    `${url}/action/aggregate`,
    {
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
    }
  ).catch((err) => console.log(err));
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
export default async function getResourcesMongoDB(queryObject, currentPage, pageSize) {
  let privateResources = process.env.PRIVATE_RESOURCES
  let nPrivate = Object.keys(privateResources).length;
  let databases = queryObject.database;
  let resources = [[], 0];
  if (!databases) {
    databases = Object.keys(privateResources);
  }
  nPrivate = databases.length;
  for (let resource in privateResources) {
    if (databases.indexOf(resource) === -1) {
      continue;
    }
    let privateResource = privateResources[resource];
    let privateAccessToken = await getToken(resource);
    let privateResourceResults = await getSearchResults(privateAccessToken,
      privateResource.url,
      privateResource.dataSource,
      privateResource.database,
      privateResource.collection,
      queryObject,
      currentPage,
      Math.floor(pageSize / (nPrivate)));
    // add private field to each resource
    privateResourceResults[0].forEach((res) => {
      res.database = resource;
    });
    console.log(privateResourceResults);
    resources[0] = resources[0].concat(privateResourceResults[0]);
    resources[1] = resources[1] + privateResourceResults[1];
  }
  resources[0].sort((a, b) => a.score < b.score ? 1 : -1);
  console.log(resources);
  return resources;
}
