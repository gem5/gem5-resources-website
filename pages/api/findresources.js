import { fetchResources } from "./resources";
import getToken from "./getToken";
import { version } from "nprogress";

/**
 * @helper
 * @async
 * @description Fetches the resources based on the query object from the MongoDB database.
 * @param {json} queryObject The query object.
 * @param {json} filters The filters object.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
async function getResourcesMongoDB(queryObject, filters) {
  // pass queryObject by value
  queryObject = { ...queryObject };
  if (!queryObject.category) {
    let categories = [];
    for (let category in filters.category) {
      categories.push(filters.category[category]);
    }
    queryObject.category = categories;
  }
  if (!queryObject.architecture) {
    let architectures = [];
    for (let architecture in filters.architecture) {
      architectures.push(filters.architecture[architecture]);
    }
    queryObject.architecture = architectures;
  }
  if (!queryObject.gem5_version) {
    let versions = [];
    for (let version in filters.versions) {
      versions.push(filters.versions[version]);
    }
    queryObject.versions = versions;
  }

  function getSort() {
    console.log(queryObject.sort);
    switch (queryObject.sort) {
      case "date":
        return { "date": -1 };
      case "name":
        return { "id": 1 };
      case "version":
        return { "gem5_version": -1 };
      case "id_asc":
        return { "id": 1 };
      case "id_desc":
        return { "id": -1 };
      case "default":
        return {
          "_id": -1
        };
      default:
        return {
          "score": { "$meta": "textScore" }
        };
    }
  }
  const access_token = await getToken();
  if (queryObject.query.trim() === '') {
    if (queryObject.sort === "relevance") {
      queryObject.sort = "default";
    }
    const res1 = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
        'Access-Control-Request-Headers': '*',
        // 'origin': 'https://gem5vision.github.io',
        "Authorization": "Bearer " + access_token,
      },
      // also apply filters on
      body: JSON.stringify({
        "dataSource": "gem5-vision",
        "database": "gem5-vision",
        "collection": "resources",
        "pipeline": [
          {
            "$match": {
              "$and": [
                { "category": { "$in": queryObject.category || [] } },
                { "architecture": { "$in": queryObject.architecture || [] } },
                // check if any keys of versions is in queryObject.versions
                { "gem5_version": { "$in": queryObject.versions || [] } },
              ]
            },
          },
          {
            "$sort": getSort()
          }
        ]
      })
    }
    ).catch(err => console.log(err));
    const resources = await res1.json();
    return resources['documents'];
  } else {
    const res = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
        'Access-Control-Request-Headers': '*',
        // 'origin': 'https://gem5vision.github.io',
        "Authorization": "Bearer " + access_token,
      },
      // also apply filters on
      body: JSON.stringify({
        "dataSource": "gem5-vision",
        "database": "gem5-vision",
        "collection": "resources",
        "pipeline": [
          {
            "$search": {
              "text": {
                "query": queryObject.query,
                "path": ["id", "description", "resources"],
                "fuzzy": {
                  "maxEdits": 2,
                  "maxExpansions": 100
                }
              },
            }
          },

          {
            "$sort": getSort()
          },
          {
            "$match": {
              "$and": [
                { "category": { "$in": queryObject.category || [] } },
                { "architecture": { "$in": queryObject.architecture || [] } },
                { "gem5_version": { "$in": queryObject.gem5_version || [] }, }
              ]
            },
          },

        ],
      })
    }).catch(err => console.log(err));
    const resources = await res.json();
    console.log(resources);
    return resources['documents']
  }
}

/**
 * @helper
 * @async
 * @description Fetches the resources based on the query object from the JSON file.
 * @param {json} queryObject The query object.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
async function getResourcesJSON(queryObject) {
  const resources = await fetchResources();
  const query = queryObject.query.trim();
  const keywords = query.split(" ");
  let results = resources.filter(resource => {
    let idMatches = keywords.filter(keyword => resource.id.toLowerCase().includes(keyword.toLowerCase())).length;
    let descMatches = keywords.filter(keyword => resource.description.toLowerCase().includes(keyword.toLowerCase())).length;
    let resMatches = 0;
    if (resource.resources) { // only search if resource.resources exists
      const resourceJSON = JSON.stringify(resource.resources).toLowerCase();
      resMatches = keywords.filter(keyword => resourceJSON.includes(keyword.toLowerCase())).length;
    }
    let totalMatches = idMatches + descMatches + resMatches;
    if (totalMatches === 0) {
      let idDistances = keywords.map(keyword => {
        const keywordLower = keyword.toLowerCase();
        return Math.min(...resource.id.toLowerCase()
          .split("-")
          .map(idPart => damerauLevenshteinDistance(keywordLower, idPart)));
      });
      idMatches = idDistances.filter(d => d < 3).length;

      // let descDistances = keywords.map(keyword => {
      //   const keywordLower = keyword.toLowerCase();
      //   return Math.min(...resource.description.toLowerCase()
      //     .split(" ")
      //     .map(descPart => damerauLevenshteinDistance(keywordLower, descPart)));
      // });
      // descMatches = descDistances.filter(d => d < 3).length;
      if (resource.resources) { // only search if resource.resources exists
        const resourceJSON = JSON.stringify(resource.resources).toLowerCase();
        resMatches = keywords.filter(keyword => resourceJSON.includes(keyword.toLowerCase())).length;
      }
      totalMatches = idMatches + descMatches + resMatches;
    }
    resource['totalMatches'] = totalMatches;
    return totalMatches > 0;
  }).sort((a, b) => b.totalMatches - a.totalMatches);
  console.log(queryObject);
  for (let filter in queryObject) {
    if (filter === 'versions') {
      results = results.filter(resource => {
        for (let version in queryObject[filter]) {
          if (resource.versions[queryObject[filter][version]]) {
            return true;
          }
        }
        return false;
      });
    }
    else if (filter !== "query" && filter !== "sort") {
      results = results.filter(resource => queryObject[filter].includes(String(resource[filter])));
    }
  }
  return results;
}

/**
 * @wrapper
 * @async
 * @description Wrapper function to fetch the resources based on the query object.
 * @param {json} queryObject The query object.
 * @param {json} filters The filters to be applied.
 * @returns {json} The resources in JSON format.
*/
export async function getResources(queryObject, filters) {
  let resources;
  // if (process.env.IS_MONGODB_ENABLED === "true") {
  // resources = await getResourcesMongoDB(queryObject, filters);
  // } else {
  resources = await getResourcesJSON(queryObject);
  // }
  return resources;
}

export default async function handler(req, res) {
  // res.status(200).json(resources);
  // find the resources that contain the query in their id
  const query = req.query.q;
  let results = await getResourcesMongoDB({ query: query }, {});
  res.status(200).json(results);
}

/**
 * @helper
 * @description Calculates the Damerau-Levenshtein distance between two strings. Used for fuzzy search.
 * @returns {number} The Damerau-Levenshtein distance between the two strings.
*/
function damerauLevenshteinDistance(a, b) {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;
  var matrix = [];
  for (var i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (var j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
        if (
          i > 1 &&
          j > 1 &&
          b.charAt(i - 1) == a.charAt(j - 2) &&
          b.charAt(i - 2) == a.charAt(j - 1)
        ) {
          matrix[i][j] = Math.min(
            matrix[i][j],
            matrix[i - 2][j - 2] + 1 // transposition
          );
        }
      }
    }
  }
  return matrix[b.length][a.length];
}
