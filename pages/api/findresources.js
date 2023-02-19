import { fetchResources } from "./resources";

export async function getResourcesMongoDB(queryObject) {
  const res = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
      'Access-Control-Request-Headers': '*',
    },
    body: JSON.stringify({
      "dataSource": "gem5-vision",
      "database": "gem5-vision",
      "collection": "resources",
      "pipeline": [
        {
          "$match": {
            "$or": [
              { "id": { "$regex": queryObject.query, "$options": "i" } },
              { "description": { "$regex": queryObject.query, "$options": "i" } },
            ]
          },
        },
      ],
    })
  }).catch(err => console.log(err));
  const resources = await res.json();
  return resources['documents']
}

export async function getResources(queryObject) {
  const resources = await fetchResources();
  const query = queryObject.query.trim();
  const keywords = query.split(" ");

  let results = resources['resources'].filter(resource => {
    const idMatches = keywords.filter(keyword => resource.id.toLowerCase().includes(keyword.toLowerCase())).length;
    const descMatches = keywords.filter(keyword => resource.description.toLowerCase().includes(keyword.toLowerCase())).length;
    let resMatches = 0;
    if (resource.resources) { // only search if resource.resources exists
      const resourceJSON = JSON.stringify(resource.resources).toLowerCase();
      resMatches = keywords.filter(keyword => resourceJSON.includes(keyword.toLowerCase())).length;
    }
    const totalMatches = idMatches + descMatches + resMatches;
    resource['totalMatches'] = totalMatches;
    return totalMatches > 0;
  }).sort((a, b) => b.totalMatches - a.totalMatches);

  for (let filter in queryObject) {
    if (filter !== "query") {
      results = results.filter(resource => queryObject[filter].includes(String(resource[filter])));
    }
  }

  return results;
}

export default async function handler(req, res) {
  // res.status(200).json(resources);
  // find the resources that contain the query in their id
  const query = req.query.q;
  let results = await getResourcesMongoDB({ query: query });
  res.status(200).json(results);
}
