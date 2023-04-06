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
        score: { $meta: "textScore" },
      };
  }
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
  let resources = [];
  const access_token = await getToken();
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
        index: "default",
        text: {
          query: queryObject.query,
          path: {
            wildcard: "*",
          },
          fuzzy: {
            maxEdits: 2,
            maxExpansions: 100,
          },
        },
      },
    });
  }
  const res = await fetch(
    `${process.env.MONGODB_URI}/action/aggregate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
        "Access-Control-Request-Headers": "*",
        // 'origin': 'https://gem5vision.github.io',
        Authorization: "Bearer " + access_token,
      },
      // also apply filters on
      body: JSON.stringify({
        dataSource: "gem5-vision",
        database: "gem5-vision",
        collection: process.env.COLLECTION,
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
