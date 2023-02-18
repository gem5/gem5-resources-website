import { fetchResources } from "./resources";

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
  let query = req.query.q;
  let results = await getResources(query);
  res.status(200).json(results);
}
